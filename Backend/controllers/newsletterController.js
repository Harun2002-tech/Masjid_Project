const Newsletter = require("../models/Newsletter");
const axios = require("axios");

// አዲስ ተከታታይ መመዝገብ
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "እባክዎ ኢሜይል ያስገቡ!" });
    }

    // 1. በራስህ Database ቀድሞ መኖሩን ቼክ ማድረግ
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "ይህ ኢሜይል ቀድሞ ተመዝግቧል!" });
    }

    // 2. በቀጥታ ወደ Brevo API መላክ (በ Axios)
    try {
      await axios.post(
        "https://api.brevo.com/v3/contacts",
        {
          email: email,
          listIds: [2], // Brevo ላይ ያለው የሊስት ID (ቁጥሩን ዳሽቦርድህ ላይ አረጋግጥ)
          updateEnabled: true,
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`✅ ${email} ወደ Brevo ተልኳል`);
    } catch (brevoError) {
      // Brevo ላይ ስህተት ቢኖር ሎግ እናድርገው ግን ምዝገባውን አናቋርጥ
      console.error(
        "Brevo API Error Details:",
        brevoError.response?.data || brevoError.message
      );
    }

    // 3. በራስህ Database ላይ ሴቭ ማድረግ
    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.status(201).json({
      success: true,
      message: "በተሳካ ሁኔታ ተመዝግበዋል! እናመሰግናለን።",
    });
  } catch (error) {
    console.error("Newsletter Controller Error:", error);
    res.status(500).json({ message: "የሰርቨር ስህተት ተከስቷል!" });
  }
};

// ሁሉንም ተመዝጋቢዎች ለማየት
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "ዳታውን ማምጣት አልተቻለም!" });
  }
};
