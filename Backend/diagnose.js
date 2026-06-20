/**
 * Diagnostic script to test Google Drive integration
 * Run: node Backend/diagnose.js
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("=" .repeat(60));
console.log("GOOGLE DRIVE INTEGRATION DIAGNOSTIC");
console.log("=" .repeat(60));

// Check environment variables
console.log("\n1. CHECKING ENVIRONMENT VARIABLES");
console.log("-" .repeat(60));

const requiredVars = {
  GOOGLE_CLIENT_EMAIL: "Google Service Account Email",
  GOOGLE_PRIVATE_KEY: "Google Service Account Private Key",
  GOOGLE_PDF_FOLDER_ID: "Google Drive PDF Folder ID",
  GOOGLE_MUSIC_FOLDER_ID: "Google Drive Music Folder ID",
  CLOUDINARY_CLOUD_NAME: "Cloudinary Cloud Name",
  CLOUDINARY_API_KEY: "Cloudinary API Key",
  CLOUDINARY_API_SECRET: "Cloudinary API Secret",
};

let allVarsSet = true;
for (const [key, description] of Object.entries(requiredVars)) {
  const value = process.env[key];
  if (value) {
    if (key === "GOOGLE_PRIVATE_KEY") {
      console.log(`✓ ${key}: [SET] (${value.length} chars)`);
    } else if (key.includes("SECRET") || key.includes("KEY")) {
      console.log(`✓ ${key}: [SET] (starts with ${value.substring(0, 10)}...)`);
    } else {
      console.log(`✓ ${key}: ${value}`);
    }
  } else {
    console.log(`✗ ${key}: NOT SET - ${description}`);
    allVarsSet = false;
  }
}

// Check imports
console.log("\n2. CHECKING MODULE IMPORTS");
console.log("-" .repeat(60));

try {
  const { uploadToCloudinary } = await import("./utils/cloudinary.js");
  console.log("✓ Cloudinary module imported successfully");
} catch (e) {
  console.log(`✗ Cloudinary import failed: ${e.message}`);
}

try {
  const { uploadToGoogleDrive, deleteFromGoogleDrive } = await import("./utils/googleDrive.js");
  console.log("✓ Google Drive module imported successfully");
} catch (e) {
  console.log(`✗ Google Drive import failed: ${e.message}`);
}

try {
  const { uploadToStorage } = await import("./middleware/multerMiddleware.js");
  console.log("✓ Multer middleware imported successfully");
} catch (e) {
  console.log(`✗ Multer middleware import failed: ${e.message}`);
}

try {
  const { addBook, getBooks } = await import("./controllers/libraryController.js");
  console.log("✓ Library controller imported successfully");
} catch (e) {
  console.log(`✗ Library controller import failed: ${e.message}`);
}

// Summary
console.log("\n" + "=" .repeat(60));
if (allVarsSet) {
  console.log("✓ ALL ENVIRONMENT VARIABLES ARE SET");
  console.log("System is ready for testing!");
} else {
  console.log("✗ SOME ENVIRONMENT VARIABLES ARE MISSING");
  console.log("Check your .env file and ensure all required variables are set");
}
console.log("=" .repeat(60));
