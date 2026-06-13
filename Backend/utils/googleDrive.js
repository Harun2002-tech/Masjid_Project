import { google } from "googleapis";
import { Readable } from "stream";

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/drive.file"]
);

const drive = google.drive({ version: "v3", auth });

const uploadToGoogleDrive = async (buffer, fileName, mimeType, folderId) => {
  const fileMetadata = {
    name: `${Date.now()}-${fileName}`,
    parents: [folderId],
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

  return `https://drive.google.com/file/d/${response.data.id}/view`;
};

export { drive, uploadToGoogleDrive };
export default uploadToGoogleDrive;
