const Upload = require("./upload.model");
const path = require("path");
const fs = require("fs");

// Upload file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { category } = req.body;

    const fileData = await Upload.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      category,
      uploadedBy: req.user.id,
      path: req.file.path
    });

    res.status(201).json({ message: "File uploaded successfully", file: fileData });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all uploads
exports.getAllUploads = async (req, res) => {
  try {
    const files = await Upload.find()
      .populate("uploadedBy", "firstName lastName email");
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Download a file
exports.downloadFile = async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.download(path.resolve(file.path), file.originalName);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a file (admin only ideally)
exports.deleteFile = async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    fs.unlinkSync(file.path); // remove from storage
    await Upload.findByIdAndDelete(req.params.id);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
