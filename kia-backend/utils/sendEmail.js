// utils/sendEmail.js
const nodemailer = require("nodemailer")
require("dotenv").config();
console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS); // just for testing, remove later
;

// ✅ Setup transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // or Gmail: "smtp.gmail.com"
  port: 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
});

// ✅ Utility function to send emails
async function sendEmail({ to, subject, text, html }) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

module.exports = { sendEmail };
