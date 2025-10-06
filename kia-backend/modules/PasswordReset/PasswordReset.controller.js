const crypto = require("crypto");
const User = require("../users/user.model");
const PasswordResetToken = require("./PasswordResetToken.model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const dns = require("dns");
// const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/auth/forgot-password

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // 16-char App Password
  },
});

exports.forgotPassword = async (req, res) => {
  dns.lookup("smtp.gmail.com", (err, address, family) => {
    console.log("SMTP Gmail resolved to:", address, family);
  });
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
      from: `"2025 GOEF Support Team" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request - 2025 GOEF",
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

        <p>If you did not request a password reset, please ignore this email or contact our support team.</p>

        <br/>
        <p style="font-size: 14px; color: #777;">
            Regards,<br/>
            <b>2025 GOEF Support Team</b>
        </p>
        </div>
    `,
    });

    res.json({ success: true, message: "Password reset token sent to email" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/*
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete old tokens
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate 6-digit token
    const token = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await PasswordResetToken.create({ userId: user._id, token, expiresAt });

    // Send mail
    const subject = "🔑 Password Reset Request - KIA Platform";
    const text = `Your reset code is: ${token}`;
    const html = `
      <h2>Password Reset Request</h2>
      <p>Hello <b>${user.firstName} ${user.lastName}</b>,</p>
      <p>We received a request to reset your password for <b>${user.email}</b>.</p>
      <p>Your reset code is:</p>
      <div style="font-size:24px;font-weight:bold;color:#33658A;">${token}</div>
      <p>This code expires in 15 minutes.</p>
    `;

    await sendEmail(user.email, subject, text, html);

    res.json({ success: true, message: "Password reset token sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

*/
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
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
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
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// POST /api/auth/set-password
exports.setPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = await PasswordResetToken.findOne({
      userId: user._id,
      token,
    });
    if (!resetToken || resetToken.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.isActive = false;
    await user.save();
    await PasswordResetToken.deleteMany({ userId: user._id });

    res.json({ success: true, message: "Password set successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
