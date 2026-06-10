import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
    },
    location: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Lecture", "Workshop", "Prayer", "Social", "Other"],
      default: "Other",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
