const express = require("express");
const router = express.Router();
const { createTeaser, getAllTeasers, deleteTeaser, getTeaserByName, uploadVideo } = require("./teaser.controller");
const adminMiddleware = require("../../middleware/adminMiddleware");

router.post("/", adminMiddleware, uploadVideo.single('video'), createTeaser);
router.get("/", getAllTeasers);
router.delete("/:id", adminMiddleware, deleteTeaser);
router.get("/:name", getTeaserByName);

module.exports = router;