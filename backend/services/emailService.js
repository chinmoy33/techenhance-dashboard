const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config();

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Email service for sending OTP and notifications via SendGrid
 */
const emailService = {
  /**
   * Sends OTP email to user
   * @param {string} email - Recipient email address
   * @param {string} otp - 6-digit OTP code
   * @param {string} type - Type of verification (email_change, password_change, account_deletion)
   * @param {string} userName - User's display name
   * @returns {Promise} SendGrid response
   */
  async sendOTP(email, otp, type, userName = "User") {
    const templates = {
      email_change: {
        subject: "🔐 Email Change Verification - Data Visualizer Pro",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">📧 Email Change Verification</h1>
              <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Data Visualizer Pro</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #2d3748; margin-bottom: 20px;">Hello ${userName}!</h2>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                You've requested to change your email address. To complete this process, please use the verification code below:
              </p>
              
              <div style="background: #f7fafc; border: 2px dashed #667eea; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0;">
                <p style="color: #2d3748; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
              </div>
              
              <div style="background: #fff5f5; border-left: 4px solid #f56565; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #c53030; font-size: 14px; margin: 0;">
                  <strong>⚠️ Security Notice:</strong> This code expires in 10 minutes. If you didn't request this change, please ignore this email.
                </p>
              </div>
              
              <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                Best regards,<br>
                <strong>Data Visualizer Pro Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        `,
      },

      password_change: {
        subject: "🔒 Password Change Verification - Data Visualizer Pro",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔒 Password Change Verification</h1>
              <p style="color: #fbb6ce; margin: 10px 0 0 0; font-size: 16px;">Data Visualizer Pro</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #2d3748; margin-bottom: 20px;">Hello ${userName}!</h2>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                You've requested to change your password. To ensure your account security, please verify your identity with the code below:
              </p>
              
              <div style="background: #f7fafc; border: 2px dashed #f5576c; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0;">
                <p style="color: #2d3748; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                <div style="font-size: 32px; font-weight: bold; color: #f5576c; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
              </div>
              
              <div style="background: #fff5f5; border-left: 4px solid #f56565; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #c53030; font-size: 14px; margin: 0;">
                  <strong>🛡️ Security Notice:</strong> This code expires in 10 minutes. If you didn't request this change, please secure your account immediately.
                </p>
              </div>
              
              <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                Best regards,<br>
                <strong>Data Visualizer Pro Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        `,
      },

      account_deletion: {
        subject: "⚠️ Account Deletion Verification - Data Visualizer Pro",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">⚠️ Account Deletion Verification</h1>
              <p style="color: #ffcccc; margin: 10px 0 0 0; font-size: 16px;">Data Visualizer Pro</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #2d3748; margin-bottom: 20px;">Hello ${userName}!</h2>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                You've requested to <strong>permanently delete</strong> your account. This action cannot be undone. To proceed, please verify your identity with the code below:
              </p>
              
              <div style="background: #f7fafc; border: 2px dashed #ff6b6b; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0;">
                <p style="color: #2d3748; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                <div style="font-size: 32px; font-weight: bold; color: #ff6b6b; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
              </div>
              
              <div style="background: #fff5f5; border-left: 4px solid #f56565; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #c53030; font-size: 14px; margin: 0;">
                  <strong>🚨 CRITICAL WARNING:</strong> Account deletion is permanent and will remove all your data, datasets, and visualizations. This code expires in 10 minutes.
                </p>
              </div>
              
              <div style="background: #f0fff4; border-left: 4px solid #48bb78; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #2f855a; font-size: 14px; margin: 0;">
                  <strong>💡 Changed your mind?</strong> Simply ignore this email and your account will remain active.
                </p>
              </div>
              
              <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                Best regards,<br>
                <strong>Data Visualizer Pro Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        `,
      },
    };

    const template = templates[type];
    if (!template) {
      throw new Error(`Unknown email template type: ${type}`);
    }

    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME,
      },
      subject: template.subject,
      html: template.html,
    };

    try {
      const response = await sgMail.send(msg);
      console.log(`✅ OTP email sent to ${email} for ${type}`);
      return response;
    } catch (error) {
      console.error("❌ SendGrid email error:", error);
      throw new Error("Failed to send verification email");
    }
  },

  /**
   * Sends account deletion confirmation email
   * @param {string} email - User's email address
   * @param {string} userName - User's display name
   */
  async sendAccountDeletionConfirmation(email, userName = "User") {
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME,
      },
      subject: "✅ Account Successfully Deleted - Data Visualizer Pro",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ Account Deleted</h1>
            <p style="color: #bbf7d0; margin: 10px 0 0 0; font-size: 16px;">Data Visualizer Pro</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2d3748; margin-bottom: 20px;">Goodbye ${userName}!</h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Your account has been successfully deleted from Data Visualizer Pro. All your data, including datasets and visualizations, has been permanently removed.
            </p>
            
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #0c4a6e; font-size: 14px; margin: 0;">
                <strong>📝 What was deleted:</strong><br>
                • Your profile and account information<br>
                • All datasets and visualizations<br>
                • Account settings and preferences<br>
                • All associated data
              </p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Thank you for using Data Visualizer Pro. If you ever decide to return, you're always welcome to create a new account.
            </p>
            
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              <strong>Data Visualizer Pro Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Account deletion confirmation sent to ${email}`);
    } catch (error) {
      console.error("❌ Failed to send deletion confirmation:", error);
      // Don't throw error here as account is already deleted
    }
  },
};

module.exports = emailService;