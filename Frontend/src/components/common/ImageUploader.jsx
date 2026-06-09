import React, { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import axios from "axios";

export default function ImageUploader({ onUploadSuccess }) {
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // ከ .env ላይ የሰርቨርህን አድራሻ ማንበብ
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 max-w-md mx-auto my-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">ፎቶ ይምረጡና ይጫኑ</h3>

      {/* የUploadthing ዝግጁ በተን */}
      <UploadButton
        url={`${serverUrl}/api/uploadthing`} // ወደ ባክአንድህ የፈጠርነው ኤፒአይ ይልከዋል
        endpoint="imageUploader" // በባክአንድ utils/uploadthing.js ላይ የሰጠኸው ስም
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          const uploadedUrl = res[0].url; // የተጫነው ፎቶ ክላውድ ሊንክ
          setImageUrl(uploadedUrl);

          console.log("📷 ፎቶው በተሳካ ሁኔታ ተጭኗል! ሊንኩ፦", uploadedUrl);

          // ይህ ፈንክሽን ሊንኩን ወደ ዋናው ፎርም (Parent Component) ለመመለስ ያገለግላል
          if (onUploadSuccess) {
            onUploadSuccess(uploadedUrl);
          }
        }}
        onUploadError={(error) => {
          setIsUploading(false);
          alert(`የፎቶ መጫን ስህተት: ${error.message}`);
          console.error("Uploadthing Error:", error);
        }}
      />

      {/* ፎቶው እየተጫነ ከሆነ ማሳያ */}
      {isUploading && (
        <p className="text-sm text-blue-500 mt-2 animate-pulse">
          ፎቶው እየተጫነ ነው... እባክዎ ይጠብቁ
        </p>
      )}

      {/* ፎቶው ተጭኖ ካለቀ በኋላ ለአይን ማረፊያ ማሳያ (Preview) */}
      {imageUrl && (
        <div className="mt-4 flex flex-col items-center">
          <p className="text-sm text-green-600 font-medium mb-2">
            ✅ ፎቶው ዝግጁ ነው!
          </p>
          <img
            src={imageUrl}
            alt="Uploaded Preview"
            className="w-40 h-40 object-cover rounded-md shadow-md border"
          />
          {/* ይህንን ሊንክ ነው ፎርሙን ሰብሚት ስታደርግ ከሌላው ዳታ ጋር አብረህ MongoDB የምትልከው */}
          <input type="hidden" value={imageUrl} />
        </div>
      )}
    </div>
  );
}
