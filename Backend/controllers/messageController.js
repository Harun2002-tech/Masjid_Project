import { getDoc, getDocs, addDoc, setDoc, deleteDoc, collections } from "../utils/firestore.js";

export const getDailyMessage = async (req, res) => {
  try {
    const messages = await getDocs(collections.messages, {
      where: [{ field: "isActive", op: "==", value: true }],
    });
    if (messages.length === 0) {
      return res.status(200).json({
        success: true, data: {
          text: "እንኳን ደህና መጡ! እባክዎን መጀመሪያ መልዕክት በአድሚን ገጽ ይመዝግቡ።",
          arabic: "مرحباً بكم", reference: "System", type: "Quote",
        },
      });
    }
    const random = Math.floor(Math.random() * messages.length);
    res.status(200).json({ success: true, data: messages[random] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "የሰርቨር ስህተት ተፈጥሯል" });
  }
};

export const createMessage = async (req, res) => {
  try {
    const newMessage = await addDoc(collections.messages, req.body);
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await getDocs(collections.messages, { orderBy: "createdAt", orderDir: "desc" });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMessageById = async (req, res) => {
  try {
    const message = await getDoc(collections.messages, req.params.id);
    if (!message) return res.status(404).json({ success: false, message: "መልዕክቱ አልተገኘም" });
    res.status(200).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateMessage = async (req, res) => {
  try {
    await setDoc(collections.messages, req.params.id, req.body);
    const message = await getDoc(collections.messages, req.params.id);
    if (!message) return res.status(404).json({ success: false, message: "ሊታደስ የሚችል መልዕክት አልተገኘም" });
    res.status(200).json({ success: true, data: message });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await deleteDoc(collections.messages, req.params.id);
    res.status(200).json({ success: true, message: "መልዕክቱ ተሰርዟል" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
