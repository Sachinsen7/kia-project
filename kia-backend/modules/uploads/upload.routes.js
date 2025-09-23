const express = require("express");
const router = express.Router();
const {
  getAllUploads,
  downloadFile,
  deleteFile,
} = require("./upload.controller");
const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

router.get("/", authMiddleware, adminMiddleware, getAllUploads);
router.get("/:id/download", authMiddleware, adminMiddleware, downloadFile);
router.delete("/:id", authMiddleware, adminMiddleware, deleteFile);

module.exports = router;
