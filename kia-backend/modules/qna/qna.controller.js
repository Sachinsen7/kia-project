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

exports.toggleLike = async (req, res) => {
    try{
        const qna = await Qna.findById(req.params.id);
        if(!qna) return res.status(400).json({message: "Qna not found"});

        const userId = req.user.id;
        const isLiked = qna.likes.includes(userId);

        if(isLiked){
            qna.likes = qna.likes.filter(id => id.toString() !== userId);
        }else{
            qna.likes.push(userId);
        }

        await qna.save();
        res.json({message: isLiked? "unliked" : "liked" , qna});
    }
    catch(err){
        res.status(500).json({message: "Server error"});
    }
}