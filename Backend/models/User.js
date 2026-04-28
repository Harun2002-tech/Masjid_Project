import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "እባክዎ ስም ያስገቡ"],
      trim: true,
    },
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
    password: {
      type: String,
      required: [true, "የይለፍ ቃል ያስፈልጋል"],
      minlength: [6, "የይለፍ ቃል ከ6 ፊደላት ማነስ የለበትም"],
      select: false, // መረጃ ስንጠራ ፓስወርድ አብሮ እንዳይመጣ ይከላከላል
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin", "superadmin", "masjid_admin"],
      default: "student",
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "roleModel",
    },
    roleModel: {
      type: String,
      enum: ["Student", "Teacher", "Masjid"],
    },
    profilePicture: {
      type: String,
      default: "/uploads/default.png",
    },
  },
  { timestamps: true }
);

// 1. ፓስወርድ ከመቀመጡ በፊት Hash ማድረጊያ (Middleware)
userSchema.pre("save", async function (next) {
  // ፓስወርዱ ካልተቀየረ ወደሚቀጥለው ስራ ሂድ
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 2. 🚀 የተስተካከለው የ matchPassword Method
// ይህ Method በ Controller ውስጥ user.matchPassword() ብለን እንድንጠራ ያስችለናል
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' የሚሰራው በ Controller ውስጥ .select("+password") ከተባለ ብቻ ነው
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
