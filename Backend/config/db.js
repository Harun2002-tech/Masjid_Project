import { db } from "./firebase.js";

const connectDB = async () => {
  try {
    await db.collection("_connectionTest").doc("test").set({ timestamp: new Date().toISOString() });
    console.log("Firebase Firestore Connected");
  } catch (error) {
    console.error("Firestore connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
