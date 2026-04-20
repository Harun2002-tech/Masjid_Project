const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Transporter ፍጠር (Gmail ከሆነ App Password ያስፈልጋል)
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // የእርስዎ ኢሜይል
      pass: process.env.EMAIL_PASS, // የ Gmail App Password
    },
  });

  // 2. የኢሜይል ይዘቱን አዘጋጅ
  const mailOptions = {
    from: `"Ruhama Academy" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html, // በአማርኛ እና በዲዛይን እንዲሆን HTML እንጠቀማለን
  };

  // 3. ኢሜይሉን ላክ
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;