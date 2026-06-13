import { getDocs, addDoc, collections } from "../utils/firestore.js";

export const getMyAchievements = async (req, res) => {
  try {
    const achievements = await getDocs(collections.achievements, {
      where: [{ field: "user", op: "==", value: req.user.id }],
      orderBy: "earnedAt", orderDir: "desc",
    });
    res.status(200).json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    res.status(500).json({ success: false, message: "ስህተት ተፈጥሯል", error: error.message });
  }
};

export const createAchievement = async (req, res) => {
  try {
    const newAchievement = await addDoc(collections.achievements, req.body);
    res.status(201).json({ success: true, data: newAchievement });
  } catch (error) {
    res.status(400).json({ success: false, message: "ስኬትን መመዝገብ አልተቻለም" });
  }
};
