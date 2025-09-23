const express = require("express");
const router = express.Router();
const {
  uploadFile,
  getAllUploads,
  downloadFile,
  deleteFile,
} = require("./upload.controller");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("./upload.middleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

router.post("/", authMiddleware, upload.single("file"), uploadFile);
router.get("/", adminMiddleware, getAllUploads);
router.get("/:id/download", authMiddleware, downloadFile);
router.delete("/:id", authMiddleware, deleteFile);

module.exports = router;
