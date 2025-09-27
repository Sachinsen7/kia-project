const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../users/user.model');
const PasswordResetToken = require('./PasswordResetToken.model');
const bcrypt = require('bcrypt');

// Reuse one transporter instead of creating new each time
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter once at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "exists" : "missing");
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete old tokens if any
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate token (6-digit code)
    const token = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await PasswordResetToken.create({ userId: user._id, token, expiresAt });

    // Send email
    await transporter.sendMail({
    from: `"KIA Support" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "🔑 Password Reset Request - KIA Platform",
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #33658A;">Password Reset Request</h2>
        <p>Hello <b>${user.firstName} ${user.lastName}</b>,</p>
        
        <p>We received a request to reset the password for your account associated with 
        <b>${user.email}</b>.</p>

        <p>Your one-time reset code is:</p>
        
        <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; letter-spacing: 3px; 
            padding: 12px 20px; background: #33658A; color: #fff; border-radius: 6px;">
            ${token}
            </span>
        </div>

        <p>This code will expire in <b>15 minutes</b>. Please enter it in the reset page to continue.</p>

        <p>If you did not request this, you can safely ignore this email. 
        Only someone with access to your email can use this code.</p>

        <br/>
        <p style="font-size: 14px; color: #777;">
            Regards,<br/>
            <b>KIA Support Team</b>
        </p>
        </div>
    `,
    });


    res.json({ success: true, message: "Password reset token sent to email" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: err.message });
  }
};

// POST /api/auth/verify-reset-code
exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = await PasswordResetToken.findOne({
      userId: user._id,
      token: code,
    });
    if (!resetToken) return res.status(400).json({ message: "Invalid code" });

    if (resetToken.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Code expired" });
    }

    res.json({
      success: true,
      message: "Code verified. You can reset your password now.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: err.message });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = await PasswordResetToken.findOne({
      userId: user._id,
      token: code,
    });
    if (!resetToken) return res.status(400).json({ message: "Invalid code" });

    if (resetToken.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Code expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete all reset tokens of this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: err.message });
  }
};