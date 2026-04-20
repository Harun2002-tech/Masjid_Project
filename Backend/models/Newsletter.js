const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
  },
  {
    timestamps: true, // createdAt እና updatedAt በራሱ ይጨምራል
  }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
