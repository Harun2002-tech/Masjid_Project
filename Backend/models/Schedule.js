const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "ይህ ፕሮግራም ለየትኛው ኮርስ እንደሆነ መጥቀስ አለበት"],
    },
    day: {
      type: String,
      required: true,
      enum: ["ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ", "እሁድ"], // ስህተት እንዳይፈጠር ምርጫዎቹን መወሰን
    },
    startTime: {
      type: String,
      required: [true, "መጀመሪያ ሰዓት ያስፈልጋል"], // ምሳሌ፡ "08:30"
    },
    endTime: {
      type: String,
      required: [true, "ማብቂያ ሰዓት ያስፈልጋል"], // ምሳሌ፡ "10:00"
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    teacher: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ፕሮግራሙን በቀናት እና በሰዓት ቅደም ተከተል ለማውጣት ይረዳል
scheduleSchema.index({ day: 1, startTime: 1 });

module.exports = mongoose.model("Schedule", scheduleSchema);
