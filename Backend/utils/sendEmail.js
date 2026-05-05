const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Transporter ፍጠር
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // በ 465 ሞክረው (ካልሰራ ወደ 587 ቀይረው)
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // *** ዋናው መፍትሄ እዚህ ጋር ነው ***
    family: 4, // Render የግድ IPv4 እንዲጠቀም ለማስገደድ
    tls: {
      rejectUnauthorized: false, // የግንኙነት ስህተቶችን ለመቀነስ
    },
  });

  // 2. የኢሜይል ይዘቱን አዘጋጅ
  const mailOptions = {
    from: `"Ruhama Academy" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3. ኢሜይሉን ላክ
  try {
    await transporter.sendMail(mailOptions);
    console.log("ኢሜይል በትክክል ተልኳል!");
  } catch (error) {
    console.error("ኢሜይል መላክ አልተቻለም:", error);
    throw error; // ስህተቱን ለ Controller እንዲያሳውቅ
  }
};

module.exports = sendEmail;
