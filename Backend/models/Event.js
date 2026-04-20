const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  isOnline: { type: Boolean, default: false },

  // ✅ ክፍያ ስለሌለው registrationRequired 'true' ሆኖ ዋጋው '0' ይሆናል
  registrationRequired: { type: Boolean, default: true },
  price: { type: Number, default: 0 },

  // ✅ አዲስ፡ ዝግጅቱ ነፃ መሆኑን በቀላሉ በ Frontend ለመለየት
  isFree: {
    type: Boolean,
    default: true,
  },

  maxAttendees: { type: Number, required: true },
  currentAttendees: { type: Number, default: 0 },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
