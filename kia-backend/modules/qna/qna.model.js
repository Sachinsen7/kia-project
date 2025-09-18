const mongoose =  require("mongoose");

const qnaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    country: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
},{timestamps: true});

module.exports = mongoose.model("Qna", qnaSchema);