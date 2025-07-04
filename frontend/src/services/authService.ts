import axios from "axios";
import { supabase } from "../supabaseClient";

// Create axios instance for backend API calls
const api = axios.create({
  baseURL: "/api/user-auth",
  timeout: 10000,
});

let cachedToken: string | null = null;

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  cachedToken = session?.access_token || null;
  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`;
  }
  return config;
});

/**
 * Enhanced auth service with backend OTP integration
 */
export const authService = {
  /**
   * Sends OTP to user's email via backend
   * @param type - Type of verification (email_change, password_change, account_deletion)
   * @param newEmail - New email for email change (optional)
   * @returns Promise with OTP send confirmation
   */
  async sendOTP(
    type: "email_change" | "password_change" | "account_deletion",
    newEmail?: string
  ) {
    try {
      const response = await api.post("/send-otp", {
        type,
        ...(newEmail && { newEmail }),
      });

      return response.data;
    } catch (error: any) {
      console.error("Send OTP error:", error);
      throw new Error(error.response?.data?.error || "Failed to send OTP");
    }
  },

  /**
   * Verifies OTP code via backend
   * @param otp - 6-digit OTP code
   * @param type - Type of verification
   * @returns Promise with verification result
   */
  async verifyOTP(
    otp: string,
    type: "email_change" | "password_change" | "account_deletion"
  ) {
    try {
      const response = await api.post("/verify-otp", {
        otp,
        type,
      });

      return response.data;
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      throw new Error(error.response?.data?.error || "Failed to verify OTP");
    }
  },

  /**
   * Updates user email via backend after OTP verification
   * @param newEmail - New email address
   * @returns Promise with update result
   */
  async updateEmail(newEmail: string) {
    try {
      const response = await api.post("/update-email", {
        newEmail,
      });

      return response.data;
    } catch (error: any) {
      console.error("Update email error:", error);
      throw new Error(error.response?.data?.error || "Failed to update email");
    }
  },

  /**
   * Updates user password via backend after OTP verification
   * @param newPassword - New password
   * @returns Promise with update result
   */
  async updatePassword(newPassword: string) {
    try {
      const response = await api.post("/update-password", {
        newPassword,
      });

      return response.data;
    } catch (error: any) {
      console.error("Update password error:", error);
      throw new Error(
        error.response?.data?.error || "Failed to update password"
      );
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
   * Deletes user account via backend after OTP verification
   * @returns Promise with deletion result
   */
  async deleteAccount() {
    try {
      const response = await api.delete("/delete-account");

      // Sign out from Supabase client
      await supabase.auth.signOut();
      cachedToken = null; // Clear token after deletion
      return response.data;
    } catch (error: any) {
      console.error("Delete account error:", error);
      throw new Error(
        error.response?.data?.error || "Failed to delete account"
      );
    }
  },

  resetCachedToken() {
    cachedToken = null;
  },

  /**
   * Gets OTP verification status
   * @param type - Type of verification to check
   * @returns Promise with OTP status
   */
  async getOTPStatus(
    type: "email_change" | "password_change" | "account_deletion"
  ) {
    try {
      const response = await api.get(`/otp-status/${type}`);
      return response.data;
    } catch (error: any) {
      console.error("Get OTP status error:", error);
      return { isVerified: false, remainingTime: 0, hasOTP: false };
    }
  },

  /**
   * Gets current user information from Supabase
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
        isGoogleUser: user.app_metadata?.provider === "google",
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

      return { success: true, message: "Signed out successfully" };
    } catch (error: any) {
      console.error("Sign out error:", error);
      throw new Error(error.message || "Failed to sign out");
    }
  },
};

export default authService;
