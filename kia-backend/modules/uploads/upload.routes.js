const express = require("express");
const multer = require("multer");
const upload = require("../../config/multer");
const { uploadVideo, deleteVideo, getAllVideos} = require("./upload.controller");
const authMiddleware = require("../../middleware/authMiddleware")

const router = express.Router();

// Middleware to handle multer errors
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'File too large. Maximum size allowed is 120MB.' });
        }
    }
    next(error);
};

router.post("/video", authMiddleware, (req, res, next) => {
    upload.single("video")(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        next();
    });
}, uploadVideo);
router.get("/videos", getAllVideos);
router.delete("/video", deleteVideo);

module.exports = router;