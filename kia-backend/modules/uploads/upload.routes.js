const express = require("express");
const upload = require("../../config/multer");
const {uploadvideo, uploadVideo} = require("./upload.controller");

const router = express.Router();

router.post("/video", upload.single("viedo"), uploadVideo);

module.exports = router;