const express = require("express");
const router = express.Router();
const { uploadFile, getAllUploads, downloadFile, deleteFile } = require("./upload.controller");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("./upload.middleware");

// Upload routes
router.post("/", authMiddleware, upload.single("file"), uploadFile);
router.get("/", authMiddleware, getAllUploads);
router.get("/:id/download", authMiddleware, downloadFile);
router.delete("/:id", authMiddleware, deleteFile); // ideally admin only

module.exports = router;
