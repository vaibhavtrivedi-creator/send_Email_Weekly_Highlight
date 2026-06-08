const nodemailer = require("nodemailer");
const fs = require("fs/promises");

async function sendWeeklyHighlightsEmail() {
  const highlights = await fs.readFile(
    "./data/corrected-highlights.txt",
    "utf-8",
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.PM_EMAIL,
    subject: "Weekly Highlights",
    text: highlights,
  });

  console.log("Email sent successfully.");
}

module.exports = { sendWeeklyHighlightsEmail };
