// Compresses/resizes images in the browser before upload so the multipart
// payload (and Cloudinary processing time) stays small. Falls back to the
// original file when it is already small or compression is unsupported.
const compressImage = (
  file,
  { maxWidth = 1080, quality = 0.82, minFileSize = 300 * 1024 } = {}
) =>
  new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith("image/")) {
      return resolve(file);
    }
    if (file.size <= minFileSize) {
      return resolve(file);
    }

    if (typeof window === "undefined" || !document.createElement("canvas").getContext) {
      return resolve(file);
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        URL.revokeObjectURL(objectUrl);
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        // Fill with white first so transparent PNGs don't turn black in JPEG.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Image compression failed"));
            const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
            resolve(
              new File([blob], `${baseName}.jpg`, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
            );
          },
          "image/jpeg",
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });

export default compressImage;
