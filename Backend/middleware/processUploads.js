import { uploadToStorage } from "./multerMiddleware.js";

const processUploads = (req, res, next) => {
  const hasFiles = req.files && Object.keys(req.files).length > 0;
  const hasFile = req.file;

  if (!hasFiles && !hasFile) {
    return next();
  }

  const uploadPromises = [];

  if (hasFiles) {
    const fileFields = Object.keys(req.files);
    fileFields.forEach((field) => {
      req.files[field].forEach((file) => {
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
  }

  if (hasFile) {
    const promise = uploadToStorage(req.file)
      .then((url) => {
        if (!req.body.uploadedUrls) req.body.uploadedUrls = {};
        req.body.uploadedUrls[req.file.fieldname] = url;
      })
      .catch((err) => {
        console.error(`Upload failed for ${req.file.fieldname}:`, err.message);
      });
    uploadPromises.push(promise);
  }

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
