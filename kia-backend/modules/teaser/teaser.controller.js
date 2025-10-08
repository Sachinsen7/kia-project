const Teaser = require("./teaser.model");
const cloudinary = require("../../config/cloudinary");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Check if file is a video
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  }
});

exports.createTeaser = async (req, res) => {
    try {
        // Check if file was uploaded by multer middleware
        if (!req.file) {
            return res.status(400).json({ message: "No video file provided" });
        }

        const { name } = req.body;

        if (!name) {
            // Delete uploaded file if name is missing
            if (req.file && req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ message: "Teaser name is required" });
        }

        try {
            // Upload video to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'video',
                folder: 'kia-teasers',
                quality: 'auto',
                format: 'mp4'
            });

            // Delete local file after upload
            fs.unlinkSync(req.file.path);

            // Create teaser with Cloudinary URL
            const teaser = await Teaser.create({
                name,
                videoUrl: result.secure_url
            });

            if (!teaser) {
                return res.status(400).json({ message: "Failed to create teaser" });
            }

            res.status(201).json({
                message: "Teaser created successfully",
                teaser: {
                    _id: teaser._id,
                    name: teaser.name,
                    videoUrl: teaser.videoUrl
                }
            });
        } catch (cloudinaryError) {
            // Delete local file if Cloudinary upload fails
            if (req.file && req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            console.error('Cloudinary upload error:', cloudinaryError);
            res.status(500).json({ message: "Failed to upload video to cloud storage" });
        }
    } catch (err) {
        console.error('Teaser creation error:', err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

exports.getAllTeasers = async (req, res) => {
    try {
        const teasers = await Teaser.find();
        if(!teasers) return res.status(400).json({message: "No teasers found"});

        res.status(200).json({message: "Teasers fetched successfully", teasers});
    }
    catch(err) {
        res.status(500).json({message: "Internal server error", error: err.message});
    }
}

exports.deleteTeaser = async (req, res) => {
    try {
        const {id} = req.params;
        const teaser = await Teaser.findByIdAndDelete(id);
        if(!teaser) return res.status(400).json({message: "Teaser not found"});

        res.status(200).json({message: "Teaser deleted successfully"});
    }
    catch(err) {
        res.status(500).json({message: "Internal server error", error: err.message});
    }
}

exports.getTeaserByName = async (req, res) => {
    try {
        const {name} = req.params;
        const teaser = await Teaser.findOne({name});
        if(!teaser) return res.status(400).json({message: "Teaser not found"});

        res.status(200).json({message: "Teaser fetched successfully", teaser});
    }
    catch(err) {
        res.status(500).json({message: "Internal server error", error: err.message});
    }
}

// Export multer upload middleware for use in routes
exports.uploadVideo = upload;