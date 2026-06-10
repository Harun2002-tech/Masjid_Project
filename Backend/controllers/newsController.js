import News from "../models/News.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all news
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.status(200).json({ success: true, count: news.length, data: news });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch news", error: err.message });
  }
};

// Get single news by ID
export const getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ success: false, message: "News not found" });
    res.status(200).json({ success: true, data: newsItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create news
export const createNews = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.imageUrl = `/uploads/news/${req.file.filename}`;
    const newsItem = await News.create(data);
    res.status(201).json({ success: true, data: newsItem });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to create news", error: err.message });
  }
};

// Update news
export const updateNews = async (req, res) => {
  try {
    const newsItem = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!newsItem) return res.status(404).json({ success: false, message: "News not found" });
    res.status(200).json({ success: true, data: newsItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete news
export const deleteNews = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ success: false, message: "News not found" });

    // Delete image if exists
    if (newsItem.imageUrl) {
      const imagePath = path.join(__dirname, "..", newsItem.imageUrl);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await newsItem.deleteOne();
    res.status(200).json({ success: true, message: "News and image deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error occurred", error: err.message });
  }
};