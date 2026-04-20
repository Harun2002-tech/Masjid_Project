const mongoose = require("mongoose");

const dailyMessageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      // እዚህ ጋር 'Hadith,other' የሚለው ተለይቶ መጻፍ አለበት
      enum: {
        values: ["Ayah", "Hadith", "Other"],
        message: "{VALUE} የተፈቀደ አይነት አይደለም",
      },
      required: [true, "እባክዎ የመልዕክቱን አይነት ይምረጡ"],
    },
    arabic: {
      type: String,
      // አንዳንድ 'Other' መልዕክቶች አረብኛ ላይኖራቸው ስለሚችል ለአያህ እና ሀዲስ ብቻ required ማድረግ ይቻላል
      required: function () {
        return this.type !== "Other";
      },
      trim: true,
    },
    text: {
      type: String,
      required: [true, "ትርጉሙ ወይም ይዘቱ መካተት አለበት"],
      trim: true,
    },
    reference: {
      type: String,
      required: [true, "ምንጩ (Reference) መጥቀስ አለበት"],
    },
    displayDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DailyMessage", dailyMessageSchema);
