const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "እባክዎ ስም ያስገቡ"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "እባክዎ የስራ ድርሻ ያስገቡ"],
      default: "Student",
    },
    content: {
      type: String,
      required: [true, "እባክዎ አስተያየት ያስገቡ"],
      maxlength: [500, "ከ500 ቃላት መብለጥ አይችልም"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    initials: {
      type: String,
      trim: true,
    },
    image: {   // ✅ ADD THIS
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", TestimonialSchema);
