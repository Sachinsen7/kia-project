const Link = require("./link.model");

// Add new link
exports.addLink = async (req, res) => {
  try {
    const { type, url } = req.body;

    if (!["youtube", "teams"].includes(type)) {
      return res.status(400).json({ message: "Invalid link type" });
    }

    const link = await Link.create({
      type,
      url,
      addedBy: req.user.id
    });

    res.status(201).json({ message: "Link added", link });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all links (history)
exports.getAllLinks = async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 })
      .populate("addedBy", "firstName lastName email");
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a link
exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findByIdAndDelete(req.params.id);
    if (!link) return res.status(404).json({ message: "Link not found" });

    res.json({ message: "Link deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
