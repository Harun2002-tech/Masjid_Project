import { uploadToStorage } from "./multerMiddleware.js";

const processUploads = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next();
  }

  const files = req.files;
  const fileFields = Object.keys(files);
  const uploadPromises = [];

  fileFields.forEach((field) => {
    files[field].forEach((file) => {
      const promise = uploadToStorage(file)
        .then((url) => {
          if (!req.body.uploadedUrls) req.body.uploadedUrls = {};
          req.body.uploadedUrls[field] = url;
        })
        .catch((err) => {
          console.error(`Upload failed for ${field}:`, err.message);
        });
      uploadPromises.push(promise);
    });
  });

  Promise.all(uploadPromises)
    .then(() => {
      if (req.body.uploadedUrls) {
        Object.assign(req.body, req.body.uploadedUrls);
        if (!req.body.uploadedFiles) {
          req.body.uploadedFiles = req.body.uploadedUrls;
        }
      }
      next();
    })
    .catch((err) => {
      console.error("Upload processing error:", err);
      next();
    });
};

export default processUploads;
