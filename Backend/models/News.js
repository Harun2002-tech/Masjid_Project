const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" },
    category: { type: String, enum: ["ማስታወቂያ","ወቅታዊ","ትምህርት","ልዩ ክስተት"], default: "ማስታወቂያ" },
    imageUrl: { type: String },
    featured: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);