const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  type: { type: String, enum: ["youtube", "teams"], required: true },
  url: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Link", linkSchema);
