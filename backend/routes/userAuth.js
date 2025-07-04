const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../supabaseClient.ts');
const { emailService } = require('../services/emailService.js');
const { otpService } = require('../services/otpService.js');

const router = express.Router();

/**
 * Middleware to extract user from Supabase token
 */
const authenticateSupabaseUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

/**
 * POST /api/user-auth/send-otp
 * Sends OTP for email change, password change, or account deletion
 */
router.post('/send-otp', [
    authenticateSupabaseUser,
    body('type').isIn(['email_change', 'password_change', 'account_deletion']).withMessage('Invalid OTP type'),
    body('newEmail').optional().isEmail().withMessage('Valid email required for email change')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { type, newEmail } = req.body;
        const user = req.user;

        // Generate OTP
        const otp = otpService.generateOTP();

        // Store OTP
        otpService.storeOTP(user.id, type, otp, 10); // 10 minutes expiration

        // Get user display name
        const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

        // Determine email to send to
        let targetEmail = user.email;
        if (type === 'email_change' && newEmail) {
            // For email change, send to current email for security
            targetEmail = user.email;
        }

        // Send OTP email
        await emailService.sendOTP(targetEmail, otp, type, userName);

        res.json({
            success: true,
            message: `OTP sent to ${targetEmail}`,
            expiresIn: 600, // 10 minutes in seconds
            // For development only - remove in production
            ...(process.env.NODE_ENV === 'development' && { otp })
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

/**
 * POST /api/user-auth/verify-otp
 * Verifies OTP code
 */
router.post('/verify-otp', [
    authenticateSupabaseUser,
    body('type').isIn(['email_change', 'password_change', 'account_deletion']).withMessage('Invalid OTP type'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { type, otp } = req.body;
        const user = req.user;

        // Verify OTP
        const isValid = otpService.verifyOTP(user.id, type, otp);

        if (!isValid) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        res.json({
            success: true,
            message: 'OTP verified successfully',
            remainingTime: otpService.getRemainingTime(user.id, type)
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});

/**
 * POST /api/user-auth/update-email
 * Updates user email after OTP verification
 */
router.post('/update-email', [
    authenticateSupabaseUser,
    body('newEmail').isEmail().withMessage('Valid email required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { newEmail } = req.body;
        const user = req.user;

        // Check if OTP is verified
        if (!otpService.isOTPVerified(user.id, 'email_change')) {
            return res.status(400).json({ error: 'Email change requires OTP verification' });
        }

        // Update email using Supabase Admin API
        const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
            email: newEmail
        });

        if (error) {
            console.error('Supabase email update error:', error);
            return res.status(400).json({ error: error.message });
        }

        // Clear OTP after successful update
        otpService.clearOTP(user.id, 'email_change');

        res.json({
            success: true,
            message: 'Email updated successfully',
            user: {
                id: data.user.id,
                email: data.user.email,
                updated_at: data.user.updated_at
            }
        });

    } catch (error) {
        console.error('Update email error:', error);
        res.status(500).json({ error: 'Failed to update email' });
    }
});

/**
 * POST /api/user-auth/update-password
 * Updates user password after OTP verification
 */
router.post('/update-password', [
    authenticateSupabaseUser,
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { newPassword } = req.body;
        const user = req.user;

        // Check if OTP is verified
        if (!otpService.isOTPVerified(user.id, 'password_change')) {
            return res.status(400).json({ error: 'Password change requires OTP verification' });
        }

        // Update password using Supabase Admin API
        const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
            password: newPassword
        });

        if (error) {
            console.error('Supabase password update error:', error);
            return res.status(400).json({ error: error.message });
        }

        // Clear OTP after successful update
        otpService.clearOTP(user.id, 'password_change');

        res.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
});

/**
 * DELETE /api/user-auth/delete-account
 * Deletes user account after OTP verification
 */
router.delete('/delete-account', authenticateSupabaseUser, async (req, res) => {
    try {
        const user = req.user;

        // Check if OTP is verified
        if (!otpService.isOTPVerified(user.id, 'account_deletion')) {
            return res.status(400).json({ error: 'Account deletion requires OTP verification' });
        }

        // Get user info for confirmation email
        const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        const userEmail = user.email;

        // Delete user using Supabase Admin API
        const { error } = await supabase.auth.admin.deleteUser(user.id);

        if (error) {
            console.error('Supabase user deletion error:', error);
            return res.status(400).json({ error: error.message });
        }

        // Clear OTP after successful deletion
        otpService.clearOTP(user.id, 'account_deletion');

        // Send confirmation email (don't wait for it)
        emailService.sendAccountDeletionConfirmation(userEmail, userName).catch(err => {
            console.error('Failed to send deletion confirmation email:', err);
        });

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });

    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

/**
 * GET /api/user-auth/otp-status/:type
 * Gets OTP verification status and remaining time
 */
router.get('/otp-status/:type', authenticateSupabaseUser, async (req, res) => {
    try {
        const { type } = req.params;
        const user = req.user;

        if (!['email_change', 'password_change', 'account_deletion'].includes(type)) {
            return res.status(400).json({ error: 'Invalid OTP type' });
        }

        const isVerified = otpService.isOTPVerified(user.id, type);
        const remainingTime = otpService.getRemainingTime(user.id, type);

        res.json({
            type,
            isVerified,
            remainingTime,
            hasOTP: remainingTime > 0
        });

    } catch (error) {
        console.error('OTP status error:', error);
        res.status(500).json({ error: 'Failed to get OTP status' });
    }
});

module.exports = router;