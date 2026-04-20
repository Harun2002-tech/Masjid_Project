const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },

  // በአንድ ትምህርት ውስጥ ሁሉንም ሊንኮች በአንድ ላይ መያዝ እንዲችል
  youtubeUrl: { type: String }, // ለ YouTube ሊንክ
  videoUrl: { type: String }, // ለተጫነ (Upload ለተደረገ) ቪዲዮ
  audioUrl: { type: String }, // ለኦዲዮ ፋይል
  pdfUrl: { type: String }, // ለፒዲኤፍ ፋይል

  description: { type: String },
  dayNumber: { type: Number, default: 1 },
  canDownload: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "የኮርሱ ርዕስ ያስፈልጋል"], trim: true },
    subject: { type: String, required: true },
    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "All Levels",
        "ጀማሪ",
        "መካከለኛ",
        "ከፍተኛ",
      ],
      default: "ጀማሪ",
    },
    description: { type: String },
    teacher: { type: String, default: "አልተገለጸም" },
    duration: { type: String },
    days: { type: String },
    time: { type: String },
    capacity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    thumbnail: { type: String },

    enrollmentOpen: {
      type: Boolean,
      default: true,
    },

    lessons: [lessonSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
