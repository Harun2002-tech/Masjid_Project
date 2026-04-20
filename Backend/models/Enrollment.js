const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    // --- የተማሪ መረጃ (ከ User ጋር የተያያዘ) ---
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    
    // --- የምዝገባ መረጃ ---
    fullName: { type: String, required: true, trim: true },
    nationalId: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ["ወንድ", "ሴት"] },
    
    // --- የፎቶ ማከማቻ (አዲስ የተጨመረ) ---
    idCardImage: { type: String, required: true }, 

    // --- የሂደት መከታተያ (Progress Tracking) ---
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
    
    // --- ሁኔታዎች (Status) ---
    applicationStatus: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
    courseStatus: { 
      type: String, 
      enum: ["active", "completed"], 
      default: "active" 
    },
    paymentStatus: { 
      type: String, 
      enum: ["unpaid", "paid"], 
      default: "unpaid" 
    },
  },
  {
    timestamps: true,
  }
);

// አንድ ተማሪ ለአንድ ኮርስ ከአንድ ጊዜ በላይ እንዳያመለክት መከላከያ
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);