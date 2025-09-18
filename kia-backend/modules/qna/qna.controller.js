const Qna = require("./qna.model");

exports.createQna = async (req, res) => {
    try{
        const {title, description, country} = req.body;

        const qna = await Qna.create({
            title,
            description,
            country,
            createdBy: req.user.id
        });
        res.status(201).json({message: "Qna created", qna});
    }
    catch(err){
        res.status(500).json({message: "Server error", error: "err.message"});
    }
}

exports.getAllQna = async (req, res) => {
    try{
        const qnas = await Qna.find()
        .populate("createdBy", "firstName lastName email")
        .populate("likes", "firstName lastName");

        res.json(qnas);
    }
    catch(err){
        res.status(500).json({message: "Server error"});
    }
}
