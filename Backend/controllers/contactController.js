import nodemailer from "nodemailer";

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "እባክዎ ስም፣ ኢሜይል እና መልእክት በትክክል መሙላትዎን ያረጋግጡ።",
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Try 465 (SSL) if 587 continues to timeout
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // This helps bypass some network restrictions
        rejectUnauthorized: false,
      },
      family: 4, // <--- Add this line to force IPv4
    });

    const mailOptions = {
      from: `"Ruhama Website" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `አዲስ መልእክት ከሩሃማ ድረ-ገጽ: ${subject || "ርዕስ የለውም"}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>አዲስ የደንበኛ መልእክት</h2>
          <p><strong>ስም:</strong> ${name}</p>
          <p><strong>ኢሜይል:</strong> ${email}</p>
          <p><strong>ጉዳዩ:</strong> ${subject || "አልተጠቀሰም"}</p>
          <p><strong>መልእክት:</strong> ${message}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "መልእክትዎ በትክክል ተልኳል!",
    });
  } catch (error) {
    console.error("❌ Nodemailer Error Detail:", error);
    return res.status(500).json({
      success: false,
      message: "መልእክቱን መላክ አልተቻለም።",
      error: error.message,
    });
  }
};
