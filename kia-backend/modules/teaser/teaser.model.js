const mongoose = require("mongoose");

const teaserSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        videoUrl: {type: String, required: true},
    }
)

module.exports = mongoose.model("Teaser", teaserSchema);