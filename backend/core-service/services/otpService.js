const crypto = require('crypto');

/**
 * OTP service for generating and managing verification codes
 */
const otpService = {
    // In-memory storage for OTPs (use Redis in production)
    otpStore: new Map(),

    /**
     * Generates a secure 6-digit OTP
     * @returns {string} 6-digit OTP code
     */
    generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    },

    /**
     * Stores OTP with expiration
     * @param {string} userId - User ID
     * @param {string} type - OTP type (email_change, password_change, account_deletion)
     * @param {string} otp - Generated OTP
     * @param {number} expirationMinutes - Expiration time in minutes (default: 10)
     */
    storeOTP(userId, type, otp, expirationMinutes = 10) {
        const key = `${userId}_${type}`;
        const expiresAt = Date.now() + (expirationMinutes * 60 * 1000);

        this.otpStore.set(key, {
            otp,
            expiresAt,
            userId,
            type,
            verified: false
        });

        // Auto-cleanup after expiration
        setTimeout(() => {
            this.otpStore.delete(key);
        }, expirationMinutes * 60 * 1000);

        console.log(`📱 OTP stored for user ${userId}, type: ${type}, expires in ${expirationMinutes} minutes`);
    },

    /**
     * Verifies OTP code
     * @param {string} userId - User ID
     * @param {string} type - OTP type
     * @param {string} otp - OTP code to verify
     * @returns {boolean} True if OTP is valid
     */
    verifyOTP(userId, type, otp) {
        const key = `${userId}_${type}`;
        const storedOTP = this.otpStore.get(key);

        if (!storedOTP) {
            console.log(`❌ No OTP found for user ${userId}, type: ${type}`);
            return false;
        }

        if (Date.now() > storedOTP.expiresAt) {
            console.log(`⏰ OTP expired for user ${userId}, type: ${type}`);
            this.otpStore.delete(key);
            return false;
        }

        if (storedOTP.otp !== otp) {
            console.log(`🔐 Invalid OTP for user ${userId}, type: ${type}`);
            return false;
        }

        // Mark as verified
        storedOTP.verified = true;
        this.otpStore.set(key, storedOTP);

        console.log(`✅ OTP verified for user ${userId}, type: ${type}`);
        return true;
    },

    /**
     * Checks if OTP is verified
     * @param {string} userId - User ID
     * @param {string} type - OTP type
     * @returns {boolean} True if OTP is verified
     */
    isOTPVerified(userId, type) {
        const key = `${userId}_${type}`;
        const storedOTP = this.otpStore.get(key);

        if (!storedOTP) return false;
        if (Date.now() > storedOTP.expiresAt) {
            this.otpStore.delete(key);
            return false;
        }

        return storedOTP.verified === true;
    },

    /**
     * Clears OTP data
     * @param {string} userId - User ID
     * @param {string} type - OTP type
     */
    clearOTP(userId, type) {
        const key = `${userId}_${type}`;
        this.otpStore.delete(key);
        console.log(`🧹 OTP cleared for user ${userId}, type: ${type}`);
    },

    /**
     * Gets remaining time for OTP
     * @param {string} userId - User ID
     * @param {string} type - OTP type
     * @returns {number} Remaining time in seconds, or 0 if expired/not found
     */
    getRemainingTime(userId, type) {
        const key = `${userId}_${type}`;
        const storedOTP = this.otpStore.get(key);

        if (!storedOTP) return 0;

        const remaining = Math.max(0, Math.floor((storedOTP.expiresAt - Date.now()) / 1000));
        return remaining;
    }
};

module.exports = otpService;