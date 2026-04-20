const News = require("../models/News");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/news");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

exports.upload = multer({ storage, fileFilter });

// Get all news
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.status(200).json({ success: true, count: news.length, data: news });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch news", error: err.message });
  }
};

// Get single news by ID
exports.getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ success: false, message: "News not found" });
    res.status(200).json({ success: true, data: newsItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create news
exports.createNews = async (req, res) => {
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
exports.updateNews = async (req, res) => {
  try {
    const newsItem = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!newsItem) return res.status(404).json({ success: false, message: "News not found" });
    res.status(200).json({ success: true, data: newsItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
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