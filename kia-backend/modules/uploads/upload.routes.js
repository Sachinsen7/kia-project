const express = require("express");
const router = express.Router();
const { uploadFile, getAllUploads, downloadFile, deleteFile } = require("./upload.controller");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("./upload.middleware");


router.post("/", authMiddleware, upload.single("file"), uploadFile);
router.get("/", authMiddleware, getAllUploads);
router.get("/:id/download", authMiddleware, downloadFile);
router.delete("/:id", authMiddleware, deleteFile); 

module.exports = router;
