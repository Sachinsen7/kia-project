const cloudinary = require("../../config/cloudinary");
const fs = require("fs");
const Video = require("./upload.model");

// Upload video
exports.uploadVideo = async (req, res) => {
  try {
    const filepath = req.file.path;
    const { category } = req.body;

    // validate category
    const allowedCategories = ["Greeting Videos", "Best Practices"];
    if (!category || !allowedCategories.includes(category)) {
      fs.unlinkSync(filepath); // cleanup file
      return res.status(400).json({ message: "Please provide a valid category" });
    }

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "video",
      folder: "kia-videos",
    });

    // remove local file after upload
    fs.unlinkSync(filepath);

    // save video in DB
    const newVideo = await Video.create({
      url: result.secure_url,
      publicId: result.public_id,      
      categories: [category],         
      uploadedBy: req.user._id || req.user.id,        
    });

    res.status(201).json({
      success: true,
      video: newVideo,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

// Fetch all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("uploadedBy", "username email")
      .sort({ createdAt: -1 });

    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const { publicId } = req.body; // 

    if (!publicId) {
      return res.status(400).json({ success: false, message: "publicId is required" });
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });

    // delete from DB
    await Video.findOneAndDelete({ publicId });

    res.json({ success: true, message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
};
