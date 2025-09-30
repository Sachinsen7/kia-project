const Qna = require("./qna.model");

exports.createQna = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const qna = await Qna.create({
      title,
      description,
      type,
      createdBy: req.user.id,
      country: user.country,
    });
    res.status(201).json({ message: "Qna created", qna });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllQna = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const qnas = await Qna.find(query)
      .populate("createdBy", "firstName lastName email")
      .populate("likes", "firstName lastName");

    res.json(qnas);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const qna = await Qna.findById(req.params.id);
    if (!qna) return res.status(404).json({ message: "QnA not found" });

    const userId = req.user.id;
    const isLiked = qna.likes.includes(userId);

    if (isLiked) {
      qna.likes = qna.likes.filter((id) => id.toString() !== userId);
    } else {
      qna.likes.push(userId);
    }

    await qna.save();

    return res.status(200).json({
      success: true,
      message: isLiked ? "Unliked successfully" : "Liked successfully",
      likes: qna.likes,
      likesCount: qna.likes.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteQna = async (req, res) => {
  try {
    const qna = await Qna.findById(req.params.id);
    if (!qna) return res.status(404).json({ message: "QnA not found" });
    if (qna.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }
    await Qna.findByIdAndDelete(req.params.id);
    res.json({ message: "Qna deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
