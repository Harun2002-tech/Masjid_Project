const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "እባክዎ የመጽሐፉን ርዕስ ያስገቡ"],
      trim: true, // በስሙ መጀመሪያና መጨረሻ ያሉ ባዶ ቦታዎችን ያጠፋል
    },
    author: {
      type: String,
      required: [true, "እባክዎ የጸሐፊ ስም ያስገቡ"],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: [
          "Tafsir",
          "Hadith",
          "Fiqh",
          "Aqidah",
          "History",
          "Language",
          "Other",
        ],
        message: "{VALUE} የተፈቀደ የካቴጎሪ አይነት አይደለም",
      },
    },
    fileUrl: {
      type: String,
      required: true,
    },
    // ፋይሉ ምን ያህል መጠን (Size) እንዳለው ማወቅ ብንፈልግ (ለምሳሌ ለተጠቃሚው ለማሳየት)
    fileSize: {
      type: String,
    },
    description: {
      type: String,
    },
    isSheikhBook: {
      type: Boolean,
      default: false,
    },
    // ስንት ጊዜ ዳውንሎድ እንደተደረገ ለመቆጠር
    downloadCount: {
      type: Number,
      default: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt እና updatedAt በራሱ እንዲጨምር
  }
);

// በመጽሐፍ ርዕስ እና በደራሲ ለመፈለግ (Search) እንዲመች ኢንዴክስ እንፍጠር
BookSchema.index({ title: "text", author: "text" });

module.exports = mongoose.model("Book", BookSchema);
