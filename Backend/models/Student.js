const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    // 1. መለያ መረጃ (Identification)
    studentID: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      sparse: true,
    },
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

    // 2. የመገናኛ እና የደህንነት መረጃ (Auth & Contact)
    email: {
      type: String,
      required: [true, "ኢሜይል ያስፈልጋል"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "እባክዎ ትክክለኛ ኢሜይል ያስገቡ",
      ],
    },
    // ⚠️ ማስተካከያ፦ ተማሪው ሲፈጠር ፓስወርድ እንዲያልፍ required: false ተደርጓል
    password: {
      type: String,
      required: false, 
      minlength: [6, "ፓስወርድ ከ6 ፊደላት ማነስ የለበትም"],
      select: false,
    },
    // ⚠️ ማስተካከያ፦ ስልክ ቁጥር የግዴታ እንዳይሆን false ተደርጓል
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      default: "student",
      enum: ["student", "admin", "teacher"],
    },

    // 3. የግል መረጃ (Personal Info)
    gender: {
      type: String,
      enum: ["ወንድ", "ሴት"],
      default: "ወንድ",
    },
    birthDate: String,
    birthPlace: String,
    nationality: { type: String, default: "ኢትዮጵያዊ" },
    maritalStatus: {
      type: String,
      enum: ["ያላገባ", "ያገባ", "የተፈታ"],
      default: "ያላገባ",
    },
    disability: { type: String, default: "የለብኝም" },

    // 4. የአድራሻ መረጃ (Address)
    region: { type: String, default: "አዲስ አበባ" },
    subCity: String,
    woreda: String,
    kebele: String,
    address: String,

    // 5. የአደጋ ጊዜ ተጠሪ (Emergency Contact)
    emergencyName: String,
    emergencyRelation: String,
    emergencyPhone: String,
    emergencyRegion: { type: String, default: "አዲስ አበባ" },
    emergencySubCity: String,
    emergencyWoreda: String,
    emergencyKebele: String,

    // 6. የትምህርት መረጃ (Academic Info)
    subjects: { type: [String], default: [] },
    gradeLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    shift: {
      type: String,
      enum: ["Morning", "Afternoon", "Night"],
      default: "Morning",
    },
    status: {
      type: String,
      enum: ["Active", "Graduated", "Dropped", "Pending"],
      default: "Active",
    },

    // 7. የፋይል መረጃ (Documents/Photos)
    photo: {
      type: String,
      default: "uploads/students/default-profile.png",
    },
    studentIDPhoto: { type: String },
    emergencyIDPhoto: { type: String },

    joinDate: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Full Name Virtual
 */
studentSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * Pre-save Hook: Password Hashing and ID Generation
 */
studentSchema.pre("save", async function () {
  const student = this;

  // ፓስወርድ ካለ ብቻ Hash እንዲያደርግ (ከሌለ ኤረር እንዳይሰጥ)
  if (student.password && student.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(student.password, salt);
  }

  // ID Generation Logic
  if (student.isNew && !student.studentID) {
    try {
      const StudentModel = mongoose.model("Student");
      const lastStudent = await StudentModel.findOne({}, {}, { sort: { createdAt: -1 } });

      let nextNumber = 1;
      if (lastStudent && lastStudent.studentID && lastStudent.studentID.includes("-")) {
        const lastIdParts = lastStudent.studentID.split("-");
        const lastNumber = parseInt(lastIdParts[1]);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
      student.studentID = `S-${String(nextNumber).padStart(3, "0")}`;
    } catch (err) {
      console.error("ID Generation Error:", err);
      throw err;
    }
  }
});

/**
 * Compare Password Method
 */
studentSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);