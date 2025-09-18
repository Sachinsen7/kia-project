const Comment = require("./comment.model");
const Qna = require("../qna/qna.model");

exports.addComment = async (req, res) => {
    try{
        const {text} = req.body;
        const {qnaId} = req.params;

        const qna = Qna.findById(qnaId);
        if(!qna) return res.status(400).json({message: "Qna not found"});

        const comment = await Comment.create({
            text,
            qna: qnaId,
            createdBy: req.user.id
        })

        res.stauts(201).json({message: "comment added"});
    }
    catch(err){
        res.status(500).json({message: "Internal server error"});
    }
}

// Get comments for qna
exports.getComments = async (req, res) => {
    try{
        const {qnaId} = req.body;

        const comments = Comment.find({qna: qnaId})
        .populate("createdBy", "firstName lastName email");
        res.json(comments);
    }
    catch(err){
        res.status(500).json({message: "Internal server error"});
    }
}

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // allow delete if user is the creator or seeded admin
    if (comment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}