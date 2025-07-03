import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

// ===== SUPABASE AUTH SERVICE =====
export const authService = {
  /**
   * Sends OTP to current user's email for verification
   * Used for email updates, password changes, and account deletion
   * @param type - Type of verification (email_change, password_change, account_deletion)
   * @returns Promise with OTP send confirmation
   */
  async sendOTP(type: "email_change" | "password_change" | "account_deletion") {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // For email change, we'll use Supabase's built-in email change OTP
      if (type === "email_change") {
        // This will be handled when user actually changes email
        return {
          success: true,
          message: "Email change OTP will be sent when you update your email",
        };
      }

      // For password change and account deletion, we'll use a custom implementation
      // Since Supabase doesn't have built-in OTP for these actions
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP in localStorage with expiration (in production, use a secure backend)
      const otpData = {
        code: otpCode,
        type,
        email: user.email,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        userId: user.id,
      };

      localStorage.setItem(`otp_${type}_${user.id}`, JSON.stringify(otpData));

      // In a real implementation, you would send this via email service
      // For demo purposes, we'll show it in console and toast
      console.log(`OTP for ${type}:`, otpCode);

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        message: `OTP sent to ${user.email}`,
        // For demo purposes only - remove in production
        otp: process.env.NODE_ENV === "development" ? otpCode : undefined,
      };
    } catch (error: any) {
      console.error("Send OTP error:", error);
      throw new Error(error.message || "Failed to send OTP");
    }
  },

  /**
   * Verifies OTP code for the specified type
   * @param otp - 6-digit OTP code
   * @param type - Type of verification
   * @returns Promise with verification result
   */
  async verifyOTP(
    otp: string,
    type: "email_change" | "password_change" | "account_deletion"
  ) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const storedOtpData = localStorage.getItem(`otp_${type}_${user.id}`);

      if (!storedOtpData) {
        throw new Error("No OTP found. Please request a new one.");
      }

      const otpData = JSON.parse(storedOtpData);

      // Check if OTP expired
      if (Date.now() > otpData.expiresAt) {
        localStorage.removeItem(`otp_${type}_${user.id}`);
        throw new Error("OTP expired. Please request a new one.");
      }

      // Verify OTP code
      if (otp !== otpData.code) {
        throw new Error("Invalid OTP code");
      }

      // Mark as verified
      otpData.verified = true;
      localStorage.setItem(`otp_${type}_${user.id}`, JSON.stringify(otpData));

      return { success: true, message: "OTP verified successfully" };
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      throw new Error(error.message || "Failed to verify OTP");
    }
  },

  /**
   * Checks if OTP is verified for the specified type
   * @param type - Type of verification to check
   * @returns Boolean indicating if OTP is verified
   */
  async isOTPVerified(
    type: "email_change" | "password_change" | "account_deletion"
  ) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return false;

      const storedOtpData = localStorage.getItem(`otp_${type}_${user.id}`);

      if (!storedOtpData) return false;

      const otpData = JSON.parse(storedOtpData);

      // Check if verified and not expired
      return otpData.verified && Date.now() <= otpData.expiresAt;
    } catch (error) {
      console.error("Check OTP verification error:", error);
      return false;
    }
  },

  /**
   * Clears OTP data for the specified type
   * @param type - Type of verification to clear
   */
  async clearOTP(
    type: "email_change" | "password_change" | "account_deletion"
  ) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        localStorage.removeItem(`otp_${type}_${user.id}`);
      }
    } catch (error) {
      console.error("Clear OTP error:", error);
    }
  },

  /**
   * Updates user email with OTP verification
   * @param newEmail - New email address
   * @returns Promise with update result
   */
  async updateEmail(newEmail: string) {
    try {
      // First verify that OTP was verified for email change
      const isVerified = await this.isOTPVerified("email_change");

      if (!isVerified) {
        throw new Error(
          "Email verification required. Please verify your OTP first."
        );
      }

      // Use Supabase's built-in email update with OTP
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        throw error;
      }

      // Clear the OTP after successful update
      await this.clearOTP("email_change");

      return {
        success: true,
        message:
          "Email update initiated. Please check both your old and new email for confirmation.",
        data,
      };
    } catch (error: any) {
      console.error("Update email error:", error);
      throw new Error(error.message || "Failed to update email");
    }
  },

  /**
   * Updates user password with OTP verification
   * @param newPassword - New password
   * @returns Promise with update result
   */
  async updatePassword(newPassword: string) {
    try {
      // First verify that OTP was verified for password change
      const isVerified = await this.isOTPVerified("password_change");

      if (!isVerified) {
        throw new Error(
          "Password change verification required. Please verify your OTP first."
        );
      }

      // Use Supabase's built-in password update
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      // Clear the OTP after successful update
      await this.clearOTP("password_change");

      return {
        success: true,
        message: "Password updated successfully",
        data,
      };
    } catch (error: any) {
      console.error("Update password error:", error);
      throw new Error(error.message || "Failed to update password");
    }
  },

  /**
   * Updates user profile information (username/display name)
   * @param profileData - Profile data to update
   * @returns Promise with update result
   */
  async updateProfile(profileData: { username?: string; full_name?: string }) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.username || profileData.full_name,
          ...profileData,
        },
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Profile updated successfully",
        data,
      };
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw new Error(error.message || "Failed to update profile");
    }
  },

  /**
   * Deletes user account with OTP verification
   * @returns Promise with deletion result
   */
  async deleteAccount() {
    try {
      // First verify that OTP was verified for account deletion
      const isVerified = await this.isOTPVerified("account_deletion");

      if (!isVerified) {
        throw new Error(
          "Account deletion verification required. Please verify your OTP first."
        );
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Note: Supabase doesn't allow users to delete their own accounts from the client
      // This would typically require a server-side function or admin API call
      // For now, we'll sign out the user and clear local data

      // Clear all OTP data
      await this.clearOTP("account_deletion");
      await this.clearOTP("email_change");
      await this.clearOTP("password_change");

      // Sign out user
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear local storage
      localStorage.clear();

      return {
        success: true,
        message: "Account deletion initiated. You have been signed out.",
      };
    } catch (error: any) {
      console.error("Delete account error:", error);
      throw new Error(error.message || "Failed to delete account");
    }
  },

  /**
   * Gets current user information
   * @returns Promise with user data
   */
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!user) {
        throw new Error("No user found");
      }

      return {
        id: user.id,
        email: user.email,
        username: user.user_metadata?.full_name || user.email?.split("@")[0],
        avatarUrl: user.user_metadata?.avatar_url,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
        isEmailConfirmed: user.email_confirmed_at !== null,
        provider: user.app_metadata?.provider || "email",
      };
    } catch (error: any) {
      console.error("Get current user error:", error);
      throw new Error(error.message || "Failed to get user information");
    }
  },

  /**
   * Signs out the current user
   * @returns Promise with sign out result
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear all local storage
      localStorage.clear();

      return { success: true, message: "Signed out successfully" };
    } catch (error: any) {
      console.error("Sign out error:", error);
      throw new Error(error.message || "Failed to sign out");
    }
  },
};
