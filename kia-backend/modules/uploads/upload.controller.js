const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

exports.uploadVideo = async (req, res) => {
  try {
    const filepath = req.file.path;

    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "video",
      folder: "kia-videos"
    });

    fs.unlinkSync(filepath);

    res.json({
      success: true,
      url: result.secure_url,
      publicid: result.public_id,
    });
  }
  catch(err) {
    res.status(5000).json({messahe: "Internal server error" + err.message});
  }
}

exports.deleteVideo = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, {resource_type: "video"});

        res.json({success: true, message: "video deleted successfully"});
    }
    catch(err) {
        res.status(500).json({message: "Internal server error" + err.message});
    }
}