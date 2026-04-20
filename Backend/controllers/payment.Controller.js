const axios = require("axios");
const Donation = require("../models/Donation");

exports.initializePayment = async (req, res) => {
  const { amount, email, first_name, last_name, bankName } = req.body;
  const tx_ref = `ruhama-tx-${Date.now()}`;

  try {
    // 1. መረጃው መኖሩን ማረጋገጥ (Validation)
    if (!amount || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Amount and Email are required!" });
    }

    // 2. ክፍያውን በ 'pending' ሁኔታ ዳታቤዝ ውስጥ መመዝገብ
    await Donation.create({
      fullName: `${first_name} ${last_name}`,
      email,
      amount,
      tx_ref,
      bankName,
      status: "pending",
    });

    // 3. ለቻፓ ጥያቄ መላክ (Data formatting አስፈላጊ ነው)
    const chapaRequestData = {
      amount: amount.toString(), // 👈 ወሳኝ፡ Chapa ቁጥር አይቀበልም፣ String መሆን አለበት
      currency: "ETB",
      email: email,
      first_name: first_name || "Ruhama",
      last_name: last_name || "Donor",
      tx_ref: tx_ref,
      callback_url: "https://webhook.site/test",
      return_url: `http://localhost:5173/donations`,
      "customization[title]": "ለሩሃማ መስጂድ ልገሳ",
    };

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      chapaRequestData,
      {
        headers: {
          // Bearer ከተባለ በኋላ አንድ Space መኖሩን አረጋግጥ
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 4. ለ React ስኬታማ መልስ መላክ
    res.json(response.data);
  } catch (error) {
    // እውነተኛው ስህተት ምን እንደሆነ ተርሚናልህ ላይ እንዲያሳይህ
    console.error(
      "❌ Chapa API Error Details:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: error.response?.data?.message || "የቻፓ ሰርቨር ምላሽ አልሰጠም",
      error: error.message,
    });
  }
};
// controllers/paymentController.js ውስጥ ከታች ጨምረው

exports.verifyPayment = async (req, res) => {
  const { tx_ref } = req.params;

  try {
    // 1. ለቻፓ የማረጋገጫ ጥያቄ መላክ
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    // 2. ክፍያው ከተሳካ ዳታቤዝ ላይ ስታተሱን ማዘመን
    if (response.data.status === "success") {
      await Donation.findOneAndUpdate(
        { tx_ref: tx_ref },
        { status: "success" }
      );
      
      return res.json({ status: "success", message: "ክፍያው ተረጋግጧል" });
    } else {
      return res.json({ status: "failed", message: "ክፍያው አልተሳካም" });
    }
    
  } catch (error) {
    console.error("Verification Error:", error.response?.data || error.message);
    res.status(500).json({ status: "error", message: "ማረጋገጥ አልተቻለም" });
  }
};