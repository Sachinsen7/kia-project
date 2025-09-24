const express = require("express");
const upload = require("../../config/multer");
const { uploadVideo, deleteVideo, getAllVideos} = require("./upload.controller");

const router = express.Router();

router.post("/video", upload.single("viedo"), uploadVideo);
router.get("/videos", getAllVideos);
router.delete("/video", deleteVideo);

module.exports = router;