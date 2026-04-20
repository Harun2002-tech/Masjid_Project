const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  tx_ref: { type: String, required: true, unique: true },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  bankName: { type: String }, // ደንበኛው የመረጠው ባንክ
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);