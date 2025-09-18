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

