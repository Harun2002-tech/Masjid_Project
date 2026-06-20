import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

let configured = false;

const ensureConfig = () => {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  configured = true;
};

const uploadToCloudinary = (buffer, folder = "ruhama") => {
  ensureConfig();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: folder, 
        resource_type: "auto", 
        access_mode: "public" // ✅ ፋይሉ ለድረ-ገጽ ክፍት እንዲሆን ያደርገዋል
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    
    Readable.from(buffer).pipe(uploadStream);
  });
};

export { cloudinary, uploadToCloudinary };
export default uploadToCloudinary;