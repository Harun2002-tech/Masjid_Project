import { getDoc, getDocs, addDoc, setDoc, deleteDoc, collections } from "../utils/firestore.js";

export const getAllNews = async (req, res) => {
  try {
    const news = await getDocs(collections.news, { orderBy: "date", orderDir: "desc" });
    res.status(200).json({ success: true, count: news.length, data: news });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch news", error: err.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const newsItem = await getDoc(collections.news, req.params.id);
    if (!newsItem) return res.status(404).json({ success: false, message: "News not found" });
    res.status(200).json({ success: true, data: newsItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createNews = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.uploadedFiles) {
      const files = typeof req.body.uploadedFiles === "string"
        ? JSON.parse(req.body.uploadedFiles) : req.body.uploadedFiles;
      if (files.image) data.imageUrl = files.image;
    }
    const newsItem = await addDoc(collections.news, data);
    res.status(201).json({ success: true, data: newsItem });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to create news", error: err.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.uploadedFiles) {
      const files = typeof req.body.uploadedFiles === "string"
        ? JSON.parse(req.body.uploadedFiles) : req.body.uploadedFiles;
      if (files.image) data.imageUrl = files.image;
    }
    await setDoc(collections.news, req.params.id, data);
    const newsItem = await getDoc(collections.news, req.params.id);
    if (!newsItem) return res.status(404).json({ success: false, message: "News not found" });
    res.status(200).json({ success: true, data: newsItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const newsItem = await getDoc(collections.news, req.params.id);
    if (!newsItem) return res.status(404).json({ success: false, message: "News not found" });
    await deleteDoc(collections.news, req.params.id);
    res.status(200).json({ success: true, message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
