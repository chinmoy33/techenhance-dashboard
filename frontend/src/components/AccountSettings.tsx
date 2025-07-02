import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  // CheckCircle,
  // X,
  Key,
  Send,
} from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";
// import { authService } from "../services/dataService";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";

const AccountSettings: React.FC = () => {
  // ===== STATE MANAGEMENT =====
  // const { user, logout } = useAuth();

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({
          username: user.user_metadata.full_name || user.email,
          avatarUrl: user.user_metadata.avatar_url,
        });
      }
    };

    getUser();
  }, []);

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "danger">(
    "profile"
  );
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Account deletion state
  const [deletionStep, setDeletionStep] = useState<
    "initial" | "verify" | "confirm"
  >("initial");
  const [deletionForm, setDeletionForm] = useState({
    password: "",
    otp: "",
    otpVerified: false,
  });

  // UI state
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    deletion: false,
  });

  // ===== PROFILE MANAGEMENT =====

  /**
   * Handles profile information updates (username, email)
   */
  // const handleProfileUpdate = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     await authService.updateProfile(profileForm);
  //     toast.success("Profile updated successfully!");
  //   } catch (error: any) {
  //     const message = error.response?.data?.error || "Failed to update profile";
  //     toast.error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /**
   * Handles input changes for profile form
   */
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ===== PASSWORD MANAGEMENT =====

  /**
   * Handles password change for email/password accounts
   */
  // const handlePasswordChange = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Validate password confirmation
  //   if (passwordForm.newPassword !== passwordForm.confirmPassword) {
  //     toast.error("New passwords do not match");
  //     return;
  //   }

  //   // Validate password strength
  //   if (passwordForm.newPassword.length < 6) {
  //     toast.error("New password must be at least 6 characters");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     await authService.changePassword(
  //       passwordForm.currentPassword,
  //       passwordForm.newPassword
  //     );
  //     toast.success("Password changed successfully!");

  //     // Clear form
  //     setPasswordForm({
  //       currentPassword: "",
  //       newPassword: "",
  //       confirmPassword: "",
  //     });
  //   } catch (error: any) {
  //     const message =
  //       error.response?.data?.error || "Failed to change password";
  //     toast.error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /**
   * Handles input changes for password form
   */
  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ===== ACCOUNT DELETION =====

  /**
   * Initiates account deletion process
   * Different flows for Google vs email/password accounts
   */
  // const initiateAccountDeletion = async () => {
  //   if (!user) return;

  //   setLoading(true);

  //   try {
  //     // For Google users, send OTP
  //     if (user.isGoogleUser) {
  //       const response = await authService.sendDeletionOTP();
  //       toast.success("OTP sent to your email address");
  //       setDeletionStep("verify");

  //       // For demo purposes, show OTP in development
  //       if (response.otp) {
  //         toast.success(`Demo OTP: ${response.otp}`, { duration: 10000 });
  //       }
  //     } else {
  //       // For email/password users, go directly to password verification
  //       setDeletionStep("verify");
  //     }
  //   } catch (error: any) {
  //     const message =
  //       error.response?.data?.error || "Failed to initiate account deletion";
  //     toast.error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /**
   * Verifies OTP for Google account deletion
   */
  // const verifyDeletionOTP = async () => {
  //   if (!deletionForm.otp || deletionForm.otp.length !== 6) {
  //     toast.error("Please enter a valid 6-digit OTP");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     await authService.verifyDeletionOTP(deletionForm.otp);
  //     toast.success("OTP verified successfully");
  //     setDeletionForm((prev) => ({ ...prev, otpVerified: true }));
  //     setDeletionStep("confirm");
  //   } catch (error: any) {
  //     const message = error.response?.data?.error || "Invalid OTP";
  //     toast.error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /**
   * Confirms and executes account deletion
   */
  // const confirmAccountDeletion = async () => {
  //   if (!user) return;

  //   // Validate based on account type
  //   if (user.isGoogleUser && !deletionForm.otpVerified) {
  //     toast.error("OTP verification required");
  //     return;
  //   }

  //   if (!user.isGoogleUser && !deletionForm.password) {
  //     toast.error("Password required for account deletion");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     await authService.deleteAccount({
  //       password: deletionForm.password,
  //       otpVerified: deletionForm.otpVerified,
  //     });

  //     toast.success("Account deleted successfully");
  //     logout(); // This will redirect to landing page
  //   } catch (error: any) {
  //     const message = error.response?.data?.error || "Failed to delete account";
  //     toast.error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /**
   * Cancels account deletion process
   */
  const cancelDeletion = () => {
    setDeletionStep("initial");
    setDeletionForm({
      password: "",
      otp: "",
      otpVerified: false,
    });
  };

  /**
   * Toggles password visibility
   */
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ===== TAB DEFINITIONS =====
  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "danger" as const, label: "Danger Zone", icon: AlertTriangle },
  ];

  // ===== RENDER COMPONENTS =====

  /**
   * Renders the profile settings tab
   */
  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Profile Information
        </h3>
        <p className="text-gray-400 mb-6">
          Update your account profile information
        </p>
      </div>

      {/* <form onSubmit={handleProfileUpdate} className="space-y-4"> */}
      <form className="space-y-4">
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <div className="relative">
            <User
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              name="username"
              value={profileForm.username}
              onChange={handleProfileInputChange}
              className="w-full pl-10 pr-4 py-3 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileInputChange}
              className="w-full pl-10 pr-4 py-3 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Account Type Info */}
        <div className="glass-card p-4 bg-blue-500/10 border-blue-500/30">
          <div className="flex items-center space-x-2">
            {user?.isGoogleUser ? (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-blue-300">Google Account</span>
              </>
            ) : (
              <>
                <Mail size={16} className="text-blue-400" />
                <span className="text-blue-300">Email Account</span>
              </>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full glass-button py-3 rounded-lg bg-primary-500/20 border-primary-500/50 hover:bg-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Updating...</span>
            </div>
          ) : (
            "Update Profile"
          )}
        </button>
      </form>
    </div>
  );

  /**
   * Renders the security settings tab
   */
  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Security Settings
        </h3>
        <p className="text-gray-400 mb-6">
          Manage your account security and password
        </p>
      </div>

      {/* Password Change Section */}
      {user?.hasPassword ? (
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <h4 className="text-md font-medium text-white mb-4 flex items-center space-x-2">
            <Key size={16} className="text-primary-400" />
            <span>Change Password</span>
          </h4>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordInputChange}
                className="w-full pl-10 pr-12 py-3 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.current ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange}
                className="w-full pl-10 pr-12 py-3 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordInputChange}
                className="w-full pl-10 pr-12 py-3 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.confirm ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="glass-card p-4 bg-yellow-500/10 border-yellow-500/30">
            <h5 className="text-sm font-medium text-yellow-300 mb-2">
              Password Requirements:
            </h5>
            <ul className="text-sm text-yellow-200 space-y-1">
              <li>• At least 6 characters long</li>
              <li>• Different from your current password</li>
              <li>• Should be unique and secure</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glass-button py-3 rounded-lg bg-primary-500/20 border-primary-500/50 hover:bg-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Changing Password...</span>
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      ) : (
        /* Google Account Info */
        <div className="glass-card p-6 bg-blue-500/10 border-blue-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <div>
              <h4 className="text-lg font-medium text-blue-300">
                Google Account Security
              </h4>
              <p className="text-blue-200">Your account is secured by Google</p>
            </div>
          </div>
          <p className="text-blue-200 text-sm">
            Password management is handled by Google. To change your password,
            please visit your Google Account settings.
          </p>
        </div>
      )}

      {/* Account Information */}
      <div className="glass-card p-4">
        <h4 className="text-md font-medium text-white mb-3">
          Account Information
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Account Type:</span>
            <span className="text-white">
              {user?.isGoogleUser ? "Google Account" : "Email Account"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Member Since:</span>
            <span className="text-white">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Login:</span>
            <span className="text-white">
              {user?.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString()
                : "Unknown"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renders the danger zone tab with account deletion
   */
  const renderDangerTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center space-x-2">
          <AlertTriangle size={20} />
          <span>Account Management</span>
        </h3>
        <p className="text-gray-400 mb-6">
          Irreversible and destructive actions. Please proceed with caution.
        </p>
      </div>

      {/* Account Deletion Section */}
      <div className="glass-card p-6 bg-red-500/10 border-red-500/30">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Trash2 size={24} className="text-red-400" />
          </div>

          <div className="flex-1">
            <h4 className="text-lg font-medium text-red-300 mb-2">
              Delete Account
            </h4>
            <p className="text-red-200 text-sm mb-4">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>

            {/* Deletion Steps */}
            {deletionStep === "initial" && (
              <div className="space-y-4">
                <div className="glass-card p-4 bg-yellow-500/10 border-yellow-500/30">
                  <h5 className="text-yellow-300 font-medium mb-2">
                    What will be deleted:
                  </h5>
                  <ul className="text-yellow-200 text-sm space-y-1">
                    <li>• Your profile and account information</li>
                    <li>• All your datasets and visualizations</li>
                    <li>• Account settings and preferences</li>
                    <li>• All associated data permanently</li>
                  </ul>
                </div>

                {/* <button
                  onClick={initiateAccountDeletion}
                  disabled={loading}
                  className="glass-button px-6 py-3 rounded-lg bg-red-500/20 border-red-500/50 hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                > */}
                <button
                  disabled={loading}
                  className="glass-button px-6 py-3 rounded-lg bg-red-500/20 border-red-500/50 hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Delete My Account"
                  )}
                </button>
              </div>
            )}

            {/* OTP Verification for Google Users */}
            {deletionStep === "verify" && user?.isGoogleUser && (
              <div className="space-y-4">
                <div className="glass-card p-4 bg-blue-500/10 border-blue-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Send size={16} className="text-blue-400" />
                    <span className="text-blue-300 font-medium">
                      Email Verification Required
                    </span>
                  </div>
                  <p className="text-blue-200 text-sm">
                    We've sent a 6-digit verification code to your email
                    address.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={deletionForm.otp}
                    onChange={(e) =>
                      setDeletionForm((prev) => ({
                        ...prev,
                        otp: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400 text-center text-lg tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={verifyDeletionOTP}
                    disabled={loading || deletionForm.otp.length !== 6}
                    className="flex-1 glass-button py-3 rounded-lg bg-primary-500/20 border-primary-500/50 hover:bg-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify Code"
                    )}
                  </button>

                  <button
                    onClick={cancelDeletion}
                    className="flex-1 glass-button py-3 rounded-lg hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Password Verification for Email Users */}
            {deletionStep === "verify" && !user?.isGoogleUser && (
              <div className="space-y-4">
                <div className="glass-card p-4 bg-yellow-500/10 border-yellow-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock size={16} className="text-yellow-400" />
                    <span className="text-yellow-300 font-medium">
                      Password Verification Required
                    </span>
                  </div>
                  <p className="text-yellow-200 text-sm">
                    Please enter your password to confirm account deletion.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPasswords.deletion ? "text" : "password"}
                      value={deletionForm.password}
                      onChange={(e) =>
                        setDeletionForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-12 py-3 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("deletion")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.deletion ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setDeletionStep("confirm")}
                    disabled={!deletionForm.password}
                    className="flex-1 glass-button py-3 rounded-lg bg-red-500/20 border-red-500/50 hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Delete
                  </button>

                  <button
                    onClick={cancelDeletion}
                    className="flex-1 glass-button py-3 rounded-lg hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Final Confirmation */}
            {deletionStep === "confirm" && (
              <div className="space-y-4">
                <div className="glass-card p-4 bg-red-500/20 border-red-500/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle size={16} className="text-red-400" />
                    <span className="text-red-300 font-medium">
                      Final Confirmation
                    </span>
                  </div>
                  <p className="text-red-200 text-sm">
                    This is your last chance to cancel. Once confirmed, your
                    account and all data will be permanently deleted.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={confirmAccountDeletion}
                    disabled={loading}
                    className="flex-1 glass-button py-3 rounded-lg bg-red-500/30 border-red-500/70 hover:bg-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400"></div>
                        <span>Deleting Account...</span>
                      </div>
                    ) : (
                      "Yes, Delete My Account"
                    )}
                  </button>

                  <button
                    onClick={cancelDeletion}
                    className="flex-1 glass-button py-3 rounded-lg bg-green-500/20 border-green-500/50 hover:bg-green-500/30 transition-all"
                  >
                    Cancel Deletion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-gray-400">
          Manage your account preferences and security settings
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="glass-card p-1 rounded-lg">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                    : "hover:bg-white/10 text-gray-300 hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="glass-card p-6">
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "security" && renderSecurityTab()}
        {activeTab === "danger" && renderDangerTab()}
      </div>
    </div>
  );
};

export default AccountSettings;
