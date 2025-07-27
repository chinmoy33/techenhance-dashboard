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
  CheckCircle,
  X,
  Key,
  Send,
  Clock,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

// Comment out the profile username, email and password change logic for future implementation because during login or signup the password setting is not mandatory.
// profile username, email and password change code yet to configure and require debugging.

const AccountSettings: React.FC = () => {
  // ===== STATE MANAGEMENT =====
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  });

  // Password change state
  // const [passwordForm, setPasswordForm] = useState({
  //   newPassword: "",
  //   confirmPassword: "",
  // });

  // OTP verification states
  const [otpStates, setOtpStates] = useState({
    // email_change: {
    //   step: "initial" as "initial" | "otp_sent" | "verified",
    //   otp: "",
    //   newEmail: "",
    //   loading: false,
    // },
    // password_change: {
    //   step: "initial" as "initial" | "otp_sent" | "verified",
    //   otp: "",
    //   loading: false,
    // },
    account_deletion: {
      step: "initial" as "initial" | "otp_sent" | "verified",
      otp: "",
      loading: false,
    },
  });

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "danger">(
    "profile"
  );
  // const [showPasswords, setShowPasswords] = useState({
  //   new: false,
  //   confirm: false,
  // });

  // ===== INITIALIZATION =====
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setProfileForm({
        username: userData.username || "",
        email: userData.email || "",
      });
    } catch (error: any) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  // ===== OTP MANAGEMENT =====
  const sendOTP = async (
    type: "email_change" | "password_change" | "account_deletion"
  ) => {
    setOtpStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], loading: true },
    }));

    try {
      const response = await authService.sendOTP(type);

      setOtpStates((prev) => ({
        ...prev,
        [type]: { ...prev[type], step: "otp_sent", loading: false },
      }));

      toast.success(response.message);

      // For demo purposes, show OTP in development
      // if (response.otp && process.env.NODE_ENV === "development") {
      //   toast.success(`Demo OTP: ${response.otp}`, { duration: 10000 });
      // }
    } catch (error: any) {
      setOtpStates((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false },
      }));
      toast.error(error.message);
    }
  };

  const verifyOTP = async (
    type: "email_change" | "password_change" | "account_deletion"
  ) => {
    const otpCode = otpStates[type].otp;

    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], loading: true },
    }));

    try {
      await authService.verifyOTP(otpCode, type);

      setOtpStates((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          step: "verified",
          loading: false,
        },
      }));

      toast.success("OTP verified successfully!");
    } catch (error: any) {
      setOtpStates((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false },
      }));
      toast.error(error.message);
    }
  };

  const resetOTPState = (
    type: "email_change" | "password_change" | "account_deletion"
  ) => {
    setOtpStates((prev) => ({
      ...prev,
      [type]: {
        step: "initial",
        otp: "",
        newEmail: type === "email_change" ? "" : prev[type].newEmail,
        loading: false,
      },
    }));
    authService.clearOTP(type);
    authService.resetCachedToken(); // Reset token
  };

  // ===== PROFILE MANAGEMENT =====
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update username/display name (no OTP required)
      if (profileForm.username !== user.username) {
        await authService.updateProfile({ username: profileForm.username });
        toast.success("Username updated successfully!");
      }

      // // For email update, we need OTP verification
      // if (profileForm.email !== user.email) {
      //   if (otpStates.email_change.step !== "verified") {
      //     // Store the new email and initiate OTP process
      //     setOtpStates((prev) => ({
      //       ...prev,
      //       email_change: { ...prev.email_change, newEmail: profileForm.email },
      //     }));
      //     toast.info(
      //       "Email change requires verification. Please verify your OTP."
      //     );
      //     return;
      //   }

      //   // If OTP is verified, proceed with email update
      //   await authService.updateEmail(profileForm.email);
      //   toast.success(
      //     "Email update initiated! Please check your email for confirmation."
      //   );
      //   resetOTPState("email_change");
      // }

      // Reload user data
      await loadUserData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== PASSWORD MANAGEMENT =====
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

  //   // Check if OTP is verified
  //   if (otpStates.password_change.step !== "verified") {
  //     toast.error("Password change requires OTP verification");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     await authService.updatePassword(passwordForm.newPassword);
  //     toast.success("Password changed successfully!");

  //     // Clear form and reset OTP state
  //     setPasswordForm({ newPassword: "", confirmPassword: "" });
  //     resetOTPState("password_change");
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ===== ACCOUNT DELETION =====
  const handleAccountDeletion = async () => {
    if (otpStates.account_deletion.step !== "verified") {
      toast.error("Account deletion requires OTP verification");
      return;
    }

    setLoading(true);

    try {
      await authService.deleteAccount();
      toast.success("Account deletion initiated. You have been signed out.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== UTILITY FUNCTIONS =====
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // const handlePasswordInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setPasswordForm((prev) => ({ ...prev, [name]: value }));
  // };

  const handleOTPInputChange = (
    type: "email_change" | "password_change" | "account_deletion",
    value: string
  ) => {
    setOtpStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], otp: value },
    }));
  };

  // const togglePasswordVisibility = (field: "new" | "confirm") => {
  //   setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  // };

  // ===== TAB DEFINITIONS =====
  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    // { id: "security" as const, label: "Security", icon: Shield },
    { id: "danger" as const, label: "Account Management", icon: AlertTriangle },
  ];

  // ===== RENDER COMPONENTS =====

  /**
   * Renders OTP verification component
   */
  const renderOTPVerification = (
    type: "email_change" | "password_change" | "account_deletion",
    title: string,
    description: string
  ) => {
    const state = otpStates[type];

    return (
      <div className="glass-card p-4 bg-blue-500/10 border-blue-500/30">
        <div className="flex items-center space-x-2 mb-3">
          <Send size={16} className="text-blue-400" />
          <span className="text-blue-300 font-medium">{title}</span>
        </div>

        <p className="text-blue-200 text-sm mb-4">{description}</p>

        {state.step === "initial" && (
          <button
            onClick={() => sendOTP(type)}
            disabled={state.loading}
            className="w-full glass-button py-2 rounded-lg bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30 transition-all disabled:opacity-50"
          >
            {state.loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending OTP...</span>
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        )}

        {state.step === "otp_sent" && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                value={state.otp}
                onChange={(e) => handleOTPInputChange(type, e.target.value)}
                className="w-full px-4 py-2 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400 text-center text-lg tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => verifyOTP(type)}
                disabled={state.loading || state.otp.length !== 6}
                className="flex-1 glass-button py-2 rounded-lg bg-green-500/20 border-green-500/50 hover:bg-green-500/30 transition-all disabled:opacity-50"
              >
                {state.loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <button
                onClick={() => resetOTPState(type)}
                className="flex-1 glass-button py-2 rounded-lg hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={() => sendOTP(type)}
              disabled={state.loading}
              className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Resend OTP
            </button>
          </div>
        )}

        {state.step === "verified" && (
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle size={16} />
            <span className="text-sm">OTP Verified Successfully</span>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renders the profile settings tab
   */
  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Profile Information
        </h3>
        <p className="text-gray-400 mb-6">Your account profile information</p>
      </div>

      {/* <form onSubmit={handleProfileUpdate} className="space-y-4"> */}
      {/* Username Field */}
      {/* <div>
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
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
              placeholder="Enter your username"
              required
            />
          </div>
        </div> */}

      {/* Email Field */}
      {/* <div>
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
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div> */}

      {/* Email Change OTP Verification */}
      {/* {profileForm.email !== user?.email && (
            <div className="mt-3">
              {renderOTPVerification(
                "email_change",
                "Email Change Verification",
                "To change your email address, please verify your identity with an OTP sent to your current email."
              )}
            </div>
          )} */}
      {/* </div> */}

      {/* Account Type Info */}
      {/* <div className="glass-card p-4 bg-blue-500/10 border-blue-500/30">
          <div className="flex items-center space-x-2">
            <Mail size={16} className="text-blue-400" />
            <span className="text-blue-300">
              {user?.provider === "google" ? "Google Account" : "Email Account"}
            </span>
          </div>
        </div> */}

      {/* Submit Button */}
      {/* <button
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
        </button> */}
      {/* </form> */}

      {/* Profile Information Display */}
      <div className="space-y-4">
        {/* Username Display */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <div className="relative">
            <User
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <div className="w-full pl-10 pr-4 py-3 glass-card border border-white/20 rounded-lg text-white">
              {profileForm.username || "Not set"}
            </div>
          </div>
        </div>

        {/* Email Display */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <div className="w-full pl-10 pr-4 py-3 glass-card border border-white/20 rounded-lg text-white">
              {profileForm.email || "Not set"}
            </div>
          </div>
        </div>

        {/* Account Type Info */}
        <div className="glass-card p-4 bg-blue-500/10 border-blue-500/30">
          <div className="flex items-center space-x-2">
            <Mail size={16} className="text-blue-400" />
            <span className="text-blue-300">
              {user?.provider === "google" ? "Google Account" : "Email Account"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renders the security settings tab
   */
  // const renderSecurityTab = () => (
  //   <div className="space-y-6">
  //     <div>
  //       <h3 className="text-lg font-semibold text-white mb-2">
  //         Security Settings
  //       </h3>
  //       <p className="text-gray-400 mb-6">
  //         Manage your account security and password
  //       </p>
  //     </div>

  //     {/* Password Change Section */}
  //     <div className="space-y-4">
  //       <h4 className="text-md font-medium text-white mb-4 flex items-center space-x-2">
  //         <Key size={16} className="text-primary-400" />
  //         <span>Change Password</span>
  //       </h4>

  //       {/* OTP Verification for Password Change */}
  //       {renderOTPVerification(
  //         "password_change",
  //         "Password Change Verification",
  //         "To change your password, please verify your identity with an OTP sent to your email."
  //       )}

  //       {/* Password Change Form - Only show if OTP is verified */}
  //       {otpStates.password_change.step === "verified" && (
  //         <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
  //           {/* New Password */}
  //           <div>
  //             <label className="block text-sm font-medium text-gray-300 mb-2">
  //               New Password
  //             </label>
  //             <div className="relative">
  //               <Lock
  //                 size={20}
  //                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
  //               />
  //               <input
  //                 type={showPasswords.new ? "text" : "password"}
  //                 name="newPassword"
  //                 value={passwordForm.newPassword}
  //                 onChange={handlePasswordInputChange}
  //                 className="w-full pl-10 pr-12 py-3 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
  //                 placeholder="Enter new password"
  //                 required
  //               />
  //               <button
  //                 type="button"
  //                 onClick={() => togglePasswordVisibility("new")}
  //                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
  //               >
  //                 {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
  //               </button>
  //             </div>
  //           </div>

  //           {/* Confirm New Password */}
  //           <div>
  //             <label className="block text-sm font-medium text-gray-300 mb-2">
  //               Confirm New Password
  //             </label>
  //             <div className="relative">
  //               <Lock
  //                 size={20}
  //                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
  //               />
  //               <input
  //                 type={showPasswords.confirm ? "text" : "password"}
  //                 name="confirmPassword"
  //                 value={passwordForm.confirmPassword}
  //                 onChange={handlePasswordInputChange}
  //                 className="w-full pl-10 pr-12 py-3 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
  //                 placeholder="Confirm new password"
  //                 required
  //               />
  //               <button
  //                 type="button"
  //                 onClick={() => togglePasswordVisibility("confirm")}
  //                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
  //               >
  //                 {showPasswords.confirm ? (
  //                   <EyeOff size={20} />
  //                 ) : (
  //                   <Eye size={20} />
  //                 )}
  //               </button>
  //             </div>
  //           </div>

  //           {/* Password Requirements */}
  //           <div className="glass-card p-4 bg-yellow-500/10 border-yellow-500/30">
  //             <h5 className="text-sm font-medium text-yellow-300 mb-2">
  //               Password Requirements:
  //             </h5>
  //             <ul className="text-sm text-yellow-200 space-y-1">
  //               <li>• At least 6 characters long</li>
  //               <li>• Should be unique and secure</li>
  //               <li>• Different from your current password</li>
  //             </ul>
  //           </div>

  //           {/* Submit Button */}
  //           <button
  //             type="submit"
  //             disabled={loading}
  //             className="w-full glass-button py-3 rounded-lg bg-primary-500/20 border-primary-500/50 hover:bg-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  //           >
  //             {loading ? (
  //               <div className="flex items-center justify-center space-x-2">
  //                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
  //                 <span>Changing Password...</span>
  //               </div>
  //             ) : (
  //               "Change Password"
  //             )}
  //           </button>
  //         </form>
  //       )}
  //     </div>

  //     {/* Account Information */}
  //     <div className="glass-card p-4">
  //       <h4 className="text-md font-medium text-white mb-3">
  //         Account Information
  //       </h4>
  //       <div className="space-y-2 text-sm">
  //         <div className="flex justify-between">
  //           <span className="text-gray-400">Account Type:</span>
  //           <span className="text-white">
  //             {user?.provider === "google" ? "Google Account" : "Email Account"}
  //           </span>
  //         </div>
  //         <div className="flex justify-between">
  //           <span className="text-gray-400">Email Confirmed:</span>
  //           <span
  //             className={
  //               user?.isEmailConfirmed ? "text-green-400" : "text-orange-400"
  //             }
  //           >
  //             {user?.isEmailConfirmed ? "Yes" : "Pending"}
  //           </span>
  //         </div>
  //         <div className="flex justify-between">
  //           <span className="text-gray-400">Member Since:</span>
  //           <span className="text-white">
  //             {user?.createdAt
  //               ? new Date(user.createdAt).toLocaleDateString()
  //               : "Unknown"}
  //           </span>
  //         </div>
  //         <div className="flex justify-between">
  //           <span className="text-gray-400">Last Sign In:</span>
  //           <span className="text-white">
  //             {user?.lastSignIn
  //               ? new Date(user.lastSignIn).toLocaleDateString()
  //               : "Unknown"}
  //           </span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  /**
   * Renders the account management tab
   */
  let attribute1;
  if (window.innerWidth <= 768) {
    attribute1 = "flex-col items-center"
  }
  else {
    attribute1 = "items-start"
  }

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
        <div className={`flex ${attribute1} space-x-4`}>
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

            {/* What will be deleted */}
            <div className="glass-card p-4 bg-yellow-500/10 border-yellow-500/30 mb-4">
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

            {/* OTP Verification for Account Deletion */}
            {otpStates.account_deletion.step !== "confirm" &&
              renderOTPVerification(
                "account_deletion",
                "Account Deletion Verification",
                "To delete your account, please verify your identity with an OTP sent to your email."
              )}

            {/* Final Confirmation */}
            {otpStates.account_deletion.step === "verified" && (
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
                    onClick={handleAccountDeletion}
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
                    onClick={() => resetOTPState("account_deletion")}
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
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading account settings...</p>
        </div>
      </div>
    );
  }

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
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
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
        {/* {activeTab === "security" && renderSecurityTab()} */}
        {activeTab === "danger" && renderDangerTab()}
      </div>
    </div>
  );
};

export default AccountSettings;
