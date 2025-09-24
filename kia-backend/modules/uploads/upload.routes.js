const express = require("express");
const upload = require("../../config/multer");
const { uploadVideo, deleteVideo, getAllVideos} = require("./upload.controller");
const authMiddleware = require("../../middleware/authMiddleware")

const router = express.Router();

router.post("/video",authMiddleware, upload.single("video"), uploadVideo);
router.get("/videos", getAllVideos);
router.delete("/video", deleteVideo);

module.exports = router;