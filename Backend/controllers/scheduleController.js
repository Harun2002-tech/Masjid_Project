import { getDoc, getDocs, addDoc, setDoc, deleteDoc, collections } from "../utils/firestore.js";

export const getSchedules = async (req, res) => {
  try {
    const schedules = await getDocs(collections.schedules, { orderBy: "createdAt", orderDir: "desc" });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "መረጃውን ማምጣት አልተቻለም", error: error.message });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const schedule = await getDoc(collections.schedules, req.params.id);
    if (!schedule) return res.status(404).json({ message: "ፕሮግራሙ አልተገኘም" });
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "መረጃውን ማምጣት አልተቻለም", error: error.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const saved = await addDoc(collections.schedules, req.body);
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "መመዝገብ አልተቻለም", error: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    await setDoc(collections.schedules, req.params.id, req.body);
    const updated = await getDoc(collections.schedules, req.params.id);
    if (!updated) return res.status(404).json({ message: "ፕሮግራሙ አልተገኘም" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "ማሻሻል አልተቻለም", error: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    await deleteDoc(collections.schedules, req.params.id);
    res.status(200).json({ message: "ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ message: "መሰረዝ አልተቻለም", error: error.message });
  }
};
