import { uploadToStorage } from "./multerMiddleware.js";

const processUploads = (req, res, next) => {
  const hasFiles = req.files && Object.keys(req.files).length > 0;
  const hasFile = req.file;

  if (!hasFiles && !hasFile) {
    return next();
  }

  const uploadPromises = [];
  let uploadFailed = false;

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
            uploadFailed = true;
          });
        uploadPromises.push(promise);
      });
    });
  }

  if (hasFile) {
    const fieldname = req.file.fieldname;
    const promise = uploadToStorage(req.file)
      .then((url) => {
        if (!req.body.uploadedUrls) req.body.uploadedUrls = {};
        req.body.uploadedUrls[fieldname] = url;
        req.body.uploadedUrls.fileUrl = url;
      })
      .catch((err) => {
        uploadFailed = true;
      });
    uploadPromises.push(promise);
  }

  Promise.all(uploadPromises)
    .then(() => {
      if (uploadFailed) {
        return res.status(500).json({
          success: false,
          message: "የፋይል ጭነት አልተሳካም። እባክዎ እንደገና ይሞክሩ።",
        });
      }
      if (req.body.uploadedUrls) {
        Object.assign(req.body, req.body.uploadedUrls);
        if (!req.body.uploadedFiles) {
          req.body.uploadedFiles = req.body.uploadedUrls;
        }
      }
      next();
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "የፋይል ጭነት ሂደት አልተሳካም።",
      });
    });
};

export default processUploads;
