const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail({ to, subject, html }) {
  try {
    const data = await resend.emails.send({
      from: `GOEF Support <${process.env.RESEND_SENDER_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("📨 Email sent:", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
}

module.exports = { sendMail };
