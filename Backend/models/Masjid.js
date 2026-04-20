const mongoose = require("mongoose");

const MasjidSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "እባክዎ የመስጂዱን ስም ያስገቡ"],
      trim: true,
    },
    city: {
      type: String,
      default: "Kombolcha",
    },
    address: {
      type: String,
      required: [true, "የመስጂዱ ሰፈር ወይም አድራሻ መጥቀስ አለበት"],
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    settings: {
      method: { type: Number, default: 5 },
      school: { type: Number, default: 0 },
    },
    offsets: {
      Fajr: { type: Number, default: 0 },
      Sunrise: { type: Number, default: 0 },
      Dhuhr: { type: Number, default: 0 },
      Asr: { type: Number, default: 0 },
      Maghrib: { type: Number, default: 0 },
      Isha: { type: Number, default: 0 },
    },
    iqamahOffsets: {
      Fajr: { type: Number, default: 20 },
      Dhuhr: { type: Number, default: 15 },
      Asr: { type: Number, default: 15 },
      Maghrib: { type: Number, default: 10 },
      Isha: { type: Number, default: 15 },
      Jumuah: { type: Number, default: 0 },
    },
    // እዚህ ጋር ነው መሆን ያለበት
    manualTimes: {
      Fajr: { type: String, default: "" },
      Sunrise: { type: String, default: "" },
      Dhuhr: { type: String, default: "" },
      Asr: { type: String, default: "" },
      Maghrib: { type: String, default: "" },
      Isha: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

MasjidSchema.index({ name: 1, city: 1 }, { unique: true });

// module.exports ሁሌም መጨረሻ ላይ!
module.exports = mongoose.model("Masjid", MasjidSchema);
