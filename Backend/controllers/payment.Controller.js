import axios from "axios";
import { addDoc, findOne, setDoc, collections } from "../utils/firestore.js";

export const initializePayment = async (req, res) => {
  const { amount, email, first_name, last_name, bankName } = req.body;
  const tx_ref = `ruhama-tx-${Date.now()}`;
  try {
    if (!amount || !email) {
      return res.status(400).json({ success: false, message: "Amount and Email are required!" });
    }
    await addDoc(collections.donations, {
      fullName: `${first_name} ${last_name}`, email, amount, tx_ref, bankName, status: "pending",
    });
    const chapaRequestData = {
      amount: amount.toString(), currency: "ETB", email,
      first_name: first_name || "Ruhama", last_name: last_name || "Donor",
      tx_ref,
      callback_url: `https://api.ruhamaislamiccenter.com/api/payment/verify/${tx_ref}`,
      return_url: "https://ruhamaislamiccenter.com/donations",
      "customization[title]": "ለሩሃማ መስጂድ ልገሳ",
    };
    const response = await axios.post("https://api.chapa.co/v1/transaction/initialize", chapaRequestData, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`, "Content-Type": "application/json" },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Chapa Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.response?.data?.message || "የቻፓ ሰርቨር ምላሽ አልሰጠም", error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { tx_ref } = req.params;
  try {
    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
    });
    if (response.data.status === "success") {
      const donation = await findOne(collections.donations, "tx_ref", tx_ref);
      if (donation) await setDoc(collections.donations, donation.id, { status: "success" });
      return res.json({ status: "success", message: "ክፍያው ተረጋግጧል" });
    } else {
      return res.json({ status: "failed", message: "ክፍያው አልተሳካም" });
    }
  } catch (error) {
    console.error("Verification Error:", error.response?.data || error.message);
    res.status(500).json({ status: "error", message: "ማረጋገጥ አልተቻለም" });
  }
};
