const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    url: {type: String, required: true},
    publicId: {type: String, required: true},
    uploadedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    categories: {type: String, enum: ["Greeting Videos", "Best Practices"], required: true},
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Video", videoSchema);