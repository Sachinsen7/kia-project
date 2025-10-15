const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");

// ✅ Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 120 * 1024 * 1024, // 120MB limit for videos (accommodates 116MB files)
  },
  fileFilter: (req, file, cb) => {
    // Allow Excel and CSV files for seeding
    if (file.fieldname === 'file') {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv', // .csv
        'application/csv' // .csv
      ];
      
      if (allowedTypes.includes(file.mimetype) || 
          file.originalname.toLowerCase().endsWith('.xlsx') ||
          file.originalname.toLowerCase().endsWith('.xls') ||
          file.originalname.toLowerCase().endsWith('.csv')) {
        cb(null, true);
      } else {
        cb(new Error('Only Excel (.xlsx, .xls) and CSV (.csv) files are allowed for seeding'), false);
      }
    } else {
      // For other file uploads (like videos), use original logic
      cb(null, true);
    }
  }
});

module.exports = upload;
