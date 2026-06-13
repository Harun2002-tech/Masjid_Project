import { uploadToStorage } from "./multerMiddleware.js";

const processUploads = (req, res, next) => {
  const hasFiles = req.files && Object.keys(req.files).length > 0;
  const hasFile = req.file;

  console.log("[processUploads] hasFile:", !!hasFile, "hasFiles:", !!hasFiles);

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
            console.log(`[processUploads] Uploaded ${field}:`, url);
            if (!req.body.uploadedUrls) req.body.uploadedUrls = {};
            req.body.uploadedUrls[field] = url;
          })
          .catch((err) => {
            console.error(`[processUploads] Upload failed for ${field}:`, err.message);
          });
        uploadPromises.push(promise);
      });
    });
  }

  if (hasFile) {
    const fieldname = req.file.fieldname;
    console.log("[processUploads] Single file fieldname:", fieldname, "mimetype:", req.file.mimetype, "size:", req.file.size);

    const promise = uploadToStorage(req.file)
      .then((url) => {
        console.log(`[processUploads] Uploaded ${fieldname}:`, url);
        if (!req.body.uploadedUrls) req.body.uploadedUrls = {};

        req.body.uploadedUrls[fieldname] = url;
        req.body.uploadedUrls.fileUrl = url;

        req.file.secure_url = url;
        req.file.path = url;
      })
      .catch((err) => {
        console.error(`[processUploads] Upload failed for ${fieldname}:`, err.message);
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
      console.log("[processUploads] req.body.fileUrl after upload:", req.body.fileUrl);
      next();
    })
    .catch((err) => {
      console.error("[processUploads] Unexpected error:", err);
      next();
    });
};

export default processUploads;
