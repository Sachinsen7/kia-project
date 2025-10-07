const mongoose = require("mongoose");
const User = require("../modules/users/user.model");
const PasswordResetToken = require("../modules/PasswordReset/PasswordResetToken.model");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env" });

async function sendSetPasswordEmails() {
  try {
    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // only send to inactive users
    const users = await User.find({ isActive: false });

    for (const user of users) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      console.log("Req token:", token);

      await PasswordResetToken.deleteMany({ userId: user._id });
      await PasswordResetToken.create({ userId: user._id, token, expiresAt });

      const link = `https://kia-project-eight.vercel.app/set-password?email=${encodeURIComponent(
        user.email
      )}&token=${token}`;
      await sendEmail({
        to: user.email,
        subject: "Set Your Password for KIA Platform",
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #33658A; text-align: center;">Welcome to KIA Platform</h2>
      
      <p>Hello <b>${user.firstName} ${user.lastName}</b>,</p>

      <p>Your account has been created successfully! To get started, please set your password by clicking the link below:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="text-decoration: none; background-color: #33658A; color: #fff; padding: 12px 24px; border-radius: 6px; font-size: 16px;">
          Set Your Password
        </a>
      </div>

      <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
      <p style="word-break: break-all; color: #33658A;">${link}</p>

      <p>This link will expire in <b>24 hours</b>. If you did not expect this email, please ignore it or contact our support team.</p>

      <br/>
      <p style="font-size: 14px; color: #777;">
        Regards,<br/>
        <b>KIA Platform Team</b>
      </p>
    </div>
  `,
      });
    }

    console.log("Set password emails sent!");
    process.exit();
  } catch (err) {
    console.error("xx Error sending set-password emails:", err);
    process.exit(1);
  }
}

// Run the function
sendSetPasswordEmails();
