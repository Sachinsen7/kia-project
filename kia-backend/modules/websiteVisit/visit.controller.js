const Visit = require("./visit.model");

// Increment visit count
exports.incrementVisit = async (req, res) => {
  try {
    let visit = await Visit.findOne();
    if (!visit) {
      visit = new Visit({ count: 1 });
    } else {
      visit.count += 1;
    }

    await visit.save();
    res.json({ success: true, count: visit.count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get current visit count
exports.getVisitCount = async (req, res) => {
  try {
    const visit = await Visit.findOne();
    res.json({ success: true, count: visit ? visit.count : 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
