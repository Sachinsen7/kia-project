const cloudinary = require("../../config/cloudinary");
const fs = require("fs");
const Video = require("./upload.model")

exports.uploadVideo = async (req, res) => {
  try {
    const filepath = req.file.path;

    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "video",
      folder: "kia-videos"
    });

    fs.unlinkSync(filepath);

    const newVideo = await Video.create({
        url: result.secure_url,
        public_id: result.public_id,
        uploadedBy: req.user._id,
    });

    res.json({
        success: true,
        video: newVideo,
    })
  }
  catch(err) {
    res.status(5000).json({messahe: "Internal server error" + err.message});
  }
}

exports.getAllVideos = async (req, res) => {
    try  {
        const videos = await Video.find().sort({createdAt: -1});
        res.json({success: true, videos});
    }
    catch(err) {
        res.status(500).json({message: "Internal server error" + err.message});
    }
}

exports.deleteVideo = async () => {
    try {
        const {publicId} = req.body;

        await cloudinary.uploader.destroy(publicId, {resource_type: "video"});

        res.json({success: true, message: "video deleted successfully"});
    }
    catch(err) {
        res.status(500).json({message: "Internal server error" + err.message});
    }
}