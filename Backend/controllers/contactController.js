import nodemailer from "nodemailer";

/**
 * @desc    የእውቂያ መልዕክት በኢሜይል መላኪያ
 * @route   POST /api/contact
 * @access  Public
 */
export const sendContactEmail = async (req, res) => {
  try {
    // 1. መረጃው በትክክል መድረሱን ማረጋገጥ (Validation)
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "እባክዎ ስም፣ ኢሜይል እና መልእክት በትክክል መሙላትዎን ያረጋግጡ።",
      });
    }

    // 2. የኢሜይል ማጓጓዣ (Transporter) ማዘጋጀት
    // Render ላይ port 465 ብዙ ጊዜ ስለሚዘጋ 587 መጠቀም ይመከራል
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // ለ port 587 false መሆን አለበት
      auth: {
        user: process.env.EMAIL_USER, // የእርሶ Gmail (ለምሳሌ፡ ruhamaislamic@gmail.com)
        pass: process.env.EMAIL_PASS, // Bjkvclclrivwbcrs (App Password)
      },
      tls: {
        rejectUnauthorized: false, // ሰርቨር ላይ የግንኙነት ስህተትን ለመከላከል
      },
    });

    // 3. የኢሜይል ይዘት እና ዲዛይን
    const mailOptions = {
      from: `"Ruhama Website" <${process.env.EMAIL_USER}>`,
      replyTo: email, // መልስ ሲሰጡ በቀጥታ ለደንበኛው እንዲደርስ
      to: process.env.EMAIL_USER,
      subject: `አዲስ መልእክት ከሩሃማ ድረ-ገጽ: ${subject || "ርዕስ የለውም"}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 15px; border: 1px solid #e0e0e0; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <h2 style="color: #064e3b; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">አዲስ የደንበኛ መልእክት</h2>
            
            <div style="margin-top: 20px;">
              <p style="margin: 5px 0;"><strong>👤 ስም:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>📧 ኢሜይል:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>📝 ጉዳዩ:</strong> ${
                subject || "አልተጠቀሰም"
              }</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 10px; color: #374151;">
              <p style="font-weight: bold; margin-bottom: 5px;">መልእክት:</p>
              <p style="line-height: 1.6;">${message}</p>
            </div>
            
            <p style="margin-top: 25px; font-size: 12px; color: #9ca3af; text-align: center;">
              ይህ መልእክት የተላከው ከሩሃማ ኢስላሚክ ሴንተር ድረ-ገጽ የእውቂያ ቅጽ ነው።
            </p>
          </div>
        </div>
      `,
    };

    // 4. ኢሜይሉን መላክ
    await transporter.sendMail(mailOptions);

    // 5. ለተጠቃሚው የተሳካ ምላሽ መላክ
    return res.status(200).json({
      success: true,
      message: "መልእክትዎ በትክክል ተልኳል! እናመሰግናለን።",
    });
  } catch (error) {
    console.error("❌ Nodemailer Error Detail:", error);

    return res.status(500).json({
      success: false,
      message: "መልእክቱን መላክ አልተቻለም። እባክዎ ቆይተው እንደገና ይሞክሩ።",
      error: error.message,
    });
  }
};
