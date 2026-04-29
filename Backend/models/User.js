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
      select: false,
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

// --- 🛠 ማስተካከያ የተደረገበት ክፍል ---

// 1. ፓስወርድ Hash ማድረጊያ (Mongoose Middleware)
// Async ስለሆነ 'next'ን ፓራሜትር ውስጥ መጨመር እና በስህተት ጊዜ ብቻ መጥራት ይሻላል
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // ስኬታማ ሲሆን ቀጣዩን ስራ እንዲቀጥል
    next();
  } catch (error) {
    // ስህተት ካለ ለ Error Handler እንዲያስተላልፍ
    next(error);
  }
});

// 2. የተስተካከለው የ matchPassword Method
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' የሚሰራው በ Controller ውስጥ .select("+password") ካለ ብቻ ነው
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
