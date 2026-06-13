import { getDoc, getDocs, addDoc, setDoc, deleteDoc, collections } from "../utils/firestore.js";

export const getEvents = async (req, res) => {
  try {
    const events = await getDocs(collections.events, {
      where: [{ field: "isActive", op: "==", value: true }],
      orderBy: "date", orderDir: "desc",
    });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await getDoc(collections.events, req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = await addDoc(collections.events, req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    await setDoc(collections.events, req.params.id, req.body);
    const event = await getDoc(collections.events, req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await deleteDoc(collections.events, req.params.id);
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
