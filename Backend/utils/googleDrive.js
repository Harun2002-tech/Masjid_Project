import { google } from "googleapis";
import { Readable } from "stream";

// -----------------------------
// Auth Setup (Service Account)
// -----------------------------
const getDrive = () => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/drive"] // full access
  );

  return google.drive({ version: "v3", auth });
};

// -----------------------------
// Upload File
// -----------------------------
const uploadToGoogleDrive = async (
  buffer,
  fileName,
  mimeType,
  folderId
) => {
  if (!folderId) {
    throw new Error("Google Drive folder ID is required");
  }

  const drive = getDrive();
  const uniqueFileName = `${Date.now()}-${fileName}`;

  try {
    // Upload file (Shared Drive supported)
    const response = await drive.files.create({
      requestBody: {
        name: uniqueFileName,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: Readable.from(buffer),
      },
      fields: "id, webViewLink",
      supportsAllDrives: true,
    });

    const fileId = response.data.id;

    // Make file public
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
      supportsAllDrives: true,
    });

    console.log(`✓ Uploaded: ${uniqueFileName}`);

    return {
      id: fileId,
      webViewLink: response.data.webViewLink,
      url: `https://drive.google.com/uc?id=${fileId}`, // direct link
      fileName: uniqueFileName,
    };
  } catch (error) {
    console.error("❌ Google Drive Upload Error:", error.message);

    if (error.message.includes("storage quota")) {
      throw new Error(
        "Use Shared Drive: service accounts cannot store in My Drive"
      );
    }

    throw error;
  }
};

// -----------------------------
// Delete File
// -----------------------------
const deleteFromGoogleDrive = async (fileId) => {
  if (!fileId) {
    throw new Error("File ID is required");
  }

  try {
    const drive = getDrive();

    await drive.files.delete({
      fileId,
      supportsAllDrives: true,
    });

    console.log(`✓ Deleted: ${fileId}`);
    return true;
  } catch (error) {
    console.error("❌ Delete Error:", error.message);
    throw error;
  }
};

// -----------------------------
// Get File Metadata
// -----------------------------
const getFileMetadata = async (fileId) => {
  if (!fileId) {
    throw new Error("File ID is required");
  }

  try {
    const drive = getDrive();

    const res = await drive.files.get({
      fileId,
      fields: "id, name, webViewLink, mimeType, size, createdTime",
      supportsAllDrives: true,
    });

    return res.data;
  } catch (error) {
    console.error("❌ Metadata Error:", error.message);
    throw error;
  }
};

// -----------------------------
// ✅ EXPORTS (FIXED)
// -----------------------------
export {
  uploadToGoogleDrive,
  deleteFromGoogleDrive,
  getFileMetadata,
};

export default uploadToGoogleDrive;