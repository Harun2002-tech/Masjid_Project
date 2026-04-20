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
      // 🚀 ለውጥ፦ ሁሉንም ወደ lowercase አድርጌያቸዋለሁ (ለማመሳሰል እንዲቀል)
      enum: ["student", "teacher", "admin", "superadmin", "masjid_admin"],
      default: "student",
      lowercase: true, // 👈 ዳታ ሲገባ በራሱ ወደ ትንንሽ ፊደል እንዲቀይረው
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // ለተማሪዎች ወይም ለመምህራን የተለየ ፕሮፋይል ካለ ማገናኛ
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "roleModel",
    },
    roleModel: {
      type: String,
      enum: ["Student", "Teacher", "Masjid"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  // ፓስወርዱ ካልተቀየረ ዝም ብለህ ተመለስ (Return)
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // 💡 ማስታወሻ፡ async ፈንክሽን ውስጥ next() መጥራት አያስፈልግም
  } catch (error) {
    throw error; // ኤረር ካለ በቀጥታ throw አድርገው
  }
});

const User = mongoose.model("User", userSchema);
export default User;
