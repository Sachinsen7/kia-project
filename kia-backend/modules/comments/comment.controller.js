const Comment = require("./comment.model");
const Qna = require("../qna/qna.model");

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { qnaId } = req.params;

    const qna = await Qna.findById(qnaId);
    if (!qna) return res.status(404).json({ message: "QnA not found" });

    // Determine display name and user reference
    let createdBy = undefined;
    let createdByName = "Unknown";
    if (req.user && req.user.role === "admin") {
      createdByName = "Admin";
    } else if (req.user && req.user.id) {
      createdBy = req.user.id;
    }

    const comment = await Comment.create({
      text,
      qna: qnaId,
      createdBy,
      createdByName,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("createdBy", "firstName lastName email");

    res
      .status(201)
      .json({ message: "Comment added", comment: populatedComment });
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

    // allow if admin OR owner
    if (req.user.role !== "admin" && comment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
