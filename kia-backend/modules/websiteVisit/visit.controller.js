const Visit = require("./visit.model");
const DailyVisit = require("./dailyVisit.model");

/**
 * ✅ Increment total & today's visit count
 * - Skips duplicate counting via cookie
 * - Optionally skips for logged-in users (PHPSESSID)
 */
exports.incrementVisit = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 🛑 Skip if user already counted today
    if (req.cookies.ck_visit_ip_counted || req.cookies.PHPSESSID) {
      const visit = await Visit.findOne();
      const daily = await DailyVisit.findOne({ date: today });

      return res.json({
        success: true,
        total: visit ? visit.count : 0,
        today: daily ? daily.count : 0,
        message: "Already counted for today",
      });
    }

    // ✅ Increment total visit count
    let visit = await Visit.findOne();
    if (!visit) {
      visit = new Visit({ count: 1 });
    } else {
      visit.count += 1;
    }
    await visit.save();

    // ✅ Increment today's visit count
    let dailyVisit = await DailyVisit.findOne({ date: today });
    if (!dailyVisit) {
      dailyVisit = new DailyVisit({ date: today, count: 1 });
    } else {
      dailyVisit.count += 1;
    }
    await dailyVisit.save();

    // ✅ Set cookie to prevent re-count for 24 hours
    res.cookie("ck_visit_ip_counted", true, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "Lax",
    });

    return res.json({
      success: true,
      message: "Visit counted successfully",
      total: visit.count,
      today: dailyVisit.count,
    });
  } catch (err) {
    console.error("Visit increment error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ✅ Get total visit count (lifetime)
 */
exports.getVisitCount = async (req, res) => {
  try {
    const visit = await Visit.findOne();
    res.json({
      success: true,
      count: visit ? visit.count : 0,
    });
  } catch (err) {
    console.error("Get total visits error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ✅ Get today's visit count
 */
exports.getTodayVisits = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const daily = await DailyVisit.findOne({ date: today });
    res.json({
      success: true,
      count: daily ? daily.count : 0,
    });
  } catch (err) {
    console.error("Get today's visits error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ✅ Get recent daily visits (for analytics)
 * ?limit=7 → last 7 days
 */
exports.getRecentDailyVisits = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 7;
    const dailyVisits = await DailyVisit.find()
      .sort({ date: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: dailyVisits.reverse(), // reverse to get oldest → newest
    });
  } catch (err) {
    console.error("Get recent daily visits error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ✅ Get combined stats (total + today)
 * Useful for dashboards
 */
exports.getAllVisits = async (req, res) => {
  try {
    const visit = await Visit.findOne();
    const today = new Date().toISOString().split("T")[0];
    const daily = await DailyVisit.findOne({ date: today });

    res.json({
      success: true,
      total: visit ? visit.count : 0,
      today: daily ? daily.count : 0,
    });
  } catch (err) {
    console.error("Get combined visits error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
