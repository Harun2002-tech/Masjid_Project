const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    // ራስ-ሰር የሚሞላ መለያ ቁጥር (Auto-generated ID)
    teacherID: {
      type: String,
      unique: true,
    },
    // የግል መረጃ
    firstName: {
      type: String,
      required: [true, "የመጀመሪያ ስም ያስፈልጋል"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "የአባት ስም ያስፈልጋል"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "ኢሜይል ያስፈልጋል"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "ትክክለኛ ኢሜይል ያስገቡ",
      ],
    },
    password: {
      type: String,
      required: [true, "የይለፍ ቃል ያስፈልጋል"],
    },
    phone: {
      type: String,
      required: [true, "ስልክ ቁጥር ያስፈልጋል"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "ወንድ", "ሴት"],
      default: "ወንድ",
      required: [true, "ጾታ መምረጥ ያስፈልጋል"],
    },

    // ተጨማሪ የግል መረጃዎች (ከAdd Sheikh ገጽ ጋር እንዲመሳሰል)
    birthDate: { type: Date },
    birthPlace: { type: String },
    nationality: { type: String, default: "ኢትዮጵያዊ" },
    maritalStatus: { type: String, default: "ያላገባ" },
    disability: { type: String, default: "የለብኝም" },

    // አድራሻ (Address)
    region: { type: String, default: "አዲስ አበባ" },
    subCity: { type: String },
    woreda: { type: String },
    kebele: { type: String },
    address: { type: String }, // ልዩ ቦታ / አድራሻ

    // የትምህርትና የሙያ መረጃ
    education: { type: String },
    institute: { type: String },
    graduationYear: { type: Number },
    ijazah: { type: String },
    experienceYears: { type: String }, // ለምሳሌ: "5 ዓመት"

    // የማስተማር ብቃት
    subjects: {
      type: [String],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "ቢያንስ አንድ ትምህርት መጥቀስ ያስፈልጋል።",
      },
    },
    teachingLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "All Levels",
    },

    // የሰዓት መረጃ (Availability)
    availableDays: [String],
    availableTime: { type: String },
    timezone: { type: String, default: "ethiopia/kombolcha" },

    // መገለጫ
    bio: {
      type: String,
      required: [true, "ባዮ (Bio) መፃፍ ያስፈልጋል"],
    },
    teachingMethod: { type: String },
    notes: { type: String },

    // ፋይሎች (Paths)
    photo: {
      type: String,
      required: [true, "የሼሁ ፎቶ ያስፈልጋል"],
    },
    idCard: { type: String }, // የመታወቂያ ፎቶ
    emergencyPhoto: { type: String }, // የተጠሪው ፎቶ

    // የድንገተኛ አደጋ ተጠሪ (Emergency Contact)
    emergencyName: { type: String },
    emergencyRelation: { type: String },
    emergencyPhone: { type: String },
    emergencyRegion: { type: String },
    emergencySubCity: { type: String },
    emergencyWoreda: { type: String },
    emergencyKebele: { type: String },

    // ሲስተም መቆጣጠሪያ
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// ራስ-ሰር ID Generator
teacherSchema.pre("save", async function () {
  if (!this.teacherID) {
    try {
      const lastTeacher = await this.constructor.findOne(
        {},
        { teacherID: 1 },
        { sort: { createdAt: -1 } }
      );

      let nextIdNumber = 1;
      if (lastTeacher && lastTeacher.teacherID) {
        const currentIdParts = lastTeacher.teacherID.split("-");
        if (currentIdParts.length > 1) {
          nextIdNumber = parseInt(currentIdParts[1]) + 1;
        }
      }
      this.teacherID = `T-${String(nextIdNumber).padStart(3, "0")}`;
    } catch (err) {
      throw err;
    }
  }
});

module.exports = mongoose.model("Teacher", teacherSchema);