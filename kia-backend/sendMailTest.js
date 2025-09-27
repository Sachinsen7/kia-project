require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail() {
  try {
    const info = await transporter.sendMail({
      from: `"KIA Project" <${process.env.EMAIL_USER}>`,
      to: "ishuustuf@gmail.com", // test receiver
      subject: "Nodemailer Test ✔",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });

    console.log("✅ Message sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

sendMail();
