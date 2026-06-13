import axios from "axios";
import { addDoc, getDocs, findOne, collections } from "../utils/firestore.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "እባክዎ ኢሜይል ያስገቡ!" });

    const existing = await findOne(collections.newsletters, "email", email);
    if (existing) return res.status(400).json({ message: "ይህ ኢሜይል ቀድሞ ተመዝግቧል!" });

    try {
      await axios.post(
        "https://api.brevo.com/v3/contacts",
        { email, listIds: [2], updateEnabled: true },
        { headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json" } }
      );
    } catch (brevoError) {
      console.error("Brevo Error:", brevoError.response?.data || brevoError.message);
    }

    await addDoc(collections.newsletters, { email });
    res.status(201).json({ success: true, message: "በተሳካ ሁኔታ ተመዝግበዋል!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "የሰርቨር ስህተት ተከስቷል!" });
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await getDocs(collections.newsletters, { orderBy: "createdAt", orderDir: "desc" });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "ዳታውን ማምጣት አልተቻለም!" });
  }
};
