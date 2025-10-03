const Visit = require("./visit.model");

// Increment visit count
exports.incrementVisit = async (req, res) => {
  try {
    // Skip counting if visitor already counted today
    if (req.cookies.ck_visit_ip_counted) {
      const visit = await Visit.findOne();
      return res.json({ success: true, count: visit ? visit.count : 0 });
    }

    // Optional: Skip counting for logged-in users (they have PHPSESSID)
    if (req.cookies.PHPSESSID) {
      const visit = await Visit.findOne();
      return res.json({ success: true, count: visit ? visit.count : 0 });
    }

    // Increment visit count
    let visit = await Visit.findOne();
    if (!visit) {
      visit = new Visit({ count: 1 });
    } else {
      visit.count += 1;
    }
    await visit.save();

    // Set cookie to mark counted for today
    res.cookie("ck_visit_ip_counted", true, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "Lax",
    });

    return res.json({ success: true, count: visit.count });
  } catch (err) {
    console.error("Visit error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get total visit count
exports.getVisitCount = async (req, res) => {
  try {
    const visit = await Visit.findOne();
    res.json({ success: true, count: visit ? visit.count : 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
