const Visit = require("./visit.model");
const DailyVisit = require("./dailyVisit.model");

// Increment visit count (both total + daily)
exports.incrementVisit = async (req, res) => {
  try {
    // Skip counting if visitor already counted today
    if (req.cookies.ck_visit_ip_counted) {
      const visit = await Visit.findOne();
      const today = new Date().toISOString().split("T")[0];
      const daily = await DailyVisit.findOne({ date: today });
      return res.json({
        success: true,
        total: visit ? visit.count : 0,
        today: daily ? daily.count : 0,
      });
    }

    // Skip for logged-in users (optional)
    if (req.cookies.PHPSESSID) {
      const visit = await Visit.findOne();
      const today = new Date().toISOString().split("T")[0];
      const daily = await DailyVisit.findOne({ date: today });
      return res.json({
        success: true,
        total: visit ? visit.count : 0,
        today: daily ? daily.count : 0,
      });
    }

    // ✅ Increment total visit
    let visit = await Visit.findOne();
    if (!visit) visit = new Visit({ count: 1 });
    else visit.count += 1;
    await visit.save();

    // ✅ Increment daily visit
    const today = new Date().toISOString().split("T")[0];
    let dailyVisit = await DailyVisit.findOne({ date: today });
    if (!dailyVisit) dailyVisit = new DailyVisit({ date: today, count: 1 });
    else dailyVisit.count += 1;
    await dailyVisit.save();

    // Set cookie for one day
    res.cookie("ck_visit_ip_counted", true, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "Lax",
    });

    return res.json({
      success: true,
      total: visit.count,
      today: dailyVisit.count,
    });
  } catch (err) {
    console.error("Visit error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get today's visit count
exports.getTodayVisits = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const daily = await DailyVisit.findOne({ date: today });
    res.json({ success: true, count: daily ? daily.count : 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get daily visits for last N days (optional analytics)
exports.getRecentDailyVisits = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 7; // last 7 days by default
    const dailyVisits = await DailyVisit.find()
      .sort({ date: -1 })
      .limit(limit);

    res.json({ success: true, data: dailyVisits.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
