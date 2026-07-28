import axios from "axios";
import { addDoc, findOne, setDoc, collections } from "../utils/firestore.js";

export const initializePayment = async (req, res) => {
  const { amount, email, first_name, last_name, bankName } = req.body;
  const tx_ref = `ruhama-tx-${Date.now()}`;

  try {
    if (!amount || !email) {
      return res.status(400).json({
        success: false,
        message: "Amount and Email are required!",
      });
    }

    const fName = first_name || "Ruhama";
    const lName = last_name || "Donor";

    // 1. መጀመሪያ Firestore ላይ "pending" እንደሆነ መመዝገብ
    await addDoc(collections.donations, {
      fullName: `${fName} ${lName}`,
      email,
      amount: Number(amount),
      tx_ref,
      bankName: bankName || "Chapa",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // 2. ለ Chapa የሚላከው ዳታ
    const chapaRequestData = {
      amount: amount.toString(),
      currency: "ETB",
      email,
      first_name: fName,
      last_name: lName,
      tx_ref,
      callback_url: `https://api.ruhamaislamiccenter.com/api/payment/verify/${tx_ref}`,
      return_url: "https://ruhamaislamiccenter.com/donations", // የFrontend የክፍያ ገፅ አድራሻ
      "customization[title]": "ለሩሃማ መስጂድ ልገሳ",
    };

    // 3. Chapa API ጥሪ
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      chapaRequestData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Chapa Error:", error.response?.data || error.message);
    res.status(500).json({
      status: "failed",
      message: error.response?.data?.message || "የቻፓ ሰርቨር ምላሽ አልሰጠም",
      error: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  const { tx_ref } = req.params;

  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status === "success") {
      const donation = await findOne(collections.donations, "tx_ref", tx_ref);
      if (donation) {
        await setDoc(collections.donations, donation.id, {
          ...donation,
          status: "success",
          updatedAt: new Date().toISOString(),
        });
      }
      return res.json({ status: "success", message: "ክፍያው ተረጋግጧል" });
    } else {
      return res.json({ status: "failed", message: "ክፍያው አልተሳካም" });
    }
  } catch (error) {
    console.error("Verification Error:", error.response?.data || error.message);
    res.status(500).json({ status: "error", message: "ማረጋገጥ አልተቻለም" });
  }
};
