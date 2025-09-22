const Comment = require("./comment.model");
const Qna = require("../qna/qna.model");

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { qnaId } = req.params;

   
    const qna = await Qna.findById(qnaId);  
    if (!qna) return res.status(404).json({ message: "QnA not found" });

    const comment = await Comment.create({
      text,
      qna: qnaId,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get comments for a QnA
exports.getComments = async (req, res) => {
  try {
    const { qnaId } = req.params; 

    const comments = await Comment.find({ qna: qnaId })  
      .populate("createdBy", "firstName lastName email");

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

  
    if (comment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
