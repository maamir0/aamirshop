const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/products/img"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + uniqueSuffix + `.${fileExtension}`);
  },
});

const upload = multer({ storage: storage });

class Multer {
  constructor() {
    this.upload;
  }

  static diskStorage(storagePath) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        console.log(file);
        cb(null, path.join(__dirname, "../public", storagePath));
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = file.mimetype.split("/")[1];
        cb(null, file.fieldname + "-" + uniqueSuffix + `.${fileExtension}`);
      },
    });
    const upload = multer({ storage: storage });
    return upload;
  }
}

module.exports = {
  upload,
  Multer,
};
