const nodemailer = require("nodemailer");

const sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // 1. የኢሜይል ማጓጓዣ (Transporter) ማዘጋጀት
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // ruhamaislamic@gmail.com
      pass: process.env.EMAIL_PASS, // Bjkvclclrivwbcrs (ያለ ክፍተት)
    },
  });

  // 2. የኢሜይል ይዘት
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, 
    subject: `አዲስ መልእክት ከሩሃማ ድረ-ገጽ: ${subject}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #064e3b;">አዲስ የደንበኛ መልእክት</h2>
        <p><strong>ስም:</strong> ${name}</p>
        <p><strong>ኢሜይል:</strong> ${email}</p>
        <p><strong>ጉዳዩ:</strong> ${subject}</p>
        <hr />
        <p><strong>መልእክት:</strong></p>
        <p>${message}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "መልእክትዎ በትክክል ተልኳል!" });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    res.status(500).json({ success: false, message: "መልእክቱን መላክ አልተቻለም።" });
  }
};

module.exports = { sendContactEmail };