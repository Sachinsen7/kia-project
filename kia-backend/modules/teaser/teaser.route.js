const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createTeaser, getAllTeasers, deleteTeaser, getTeaserByName, uploadVideo } = require("./teaser.controller");
const adminMiddleware = require("../../middleware/adminMiddleware");

// Middleware to handle multer errors
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'File too large. Maximum size allowed is 120MB.' });
        }
    }
    next(error);
};

router.post("/", adminMiddleware, (req, res, next) => {
    uploadVideo.single('video')(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        next();
    });
}, createTeaser);
router.get("/", getAllTeasers);
router.delete("/:id", adminMiddleware, deleteTeaser);
router.get("/:name", getTeaserByName);

module.exports = router;