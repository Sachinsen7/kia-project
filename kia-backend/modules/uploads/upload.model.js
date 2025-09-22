const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileType: { type: String, required: true },
  category: { type: String, enum: ["best-practice", "greeting-video"], required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  path: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Upload", uploadSchema);
