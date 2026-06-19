import { google } from "googleapis";
import { Readable } from "stream";

const getDrive = () => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/drive.file"]
  );
  return google.drive({ version: "v3", auth });
};

const uploadToGoogleDrive = async (buffer, fileName, mimeType, folderId) => {
  const drive = getDrive();
  const fileMetadata = {
    name: `${Date.now()}-${fileName}`,
    parents: [folderId ? folderId.trim() : folderId],
  };

  const media = {
    mimeType,
    body: Readable.from(buffer),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, webViewLink",
  });

  try {
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  } catch (permErr) {
    console.error("Error setting public permission:", permErr);
  }

  return `https://drive.google.com/file/d/${response.data.id}/view`;
};

export { uploadToGoogleDrive };
export default uploadToGoogleDrive;
