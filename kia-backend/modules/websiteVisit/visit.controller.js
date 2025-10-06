const Visit = require("./visit.model");
const DailyVisit = require("./dailyVisit.model");

/**
 * ✅ Increment total & today's visit count
 * - Only counts actual visits, not refreshes
 * - Uses session-based tracking to prevent duplicate counting
 */
exports.incrementVisit = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers.referer || '';
    const sessionId = req.cookies.ck_session_id;
    
    // Debug logging
    console.log("Visit API called - Session ID:", sessionId);
    console.log("Referer:", referer);
    console.log("User Agent:", userAgent);

    // Check if this is a refresh (same session, same referer)
    if (sessionId && req.cookies.ck_visit_counted) {
      const visit = await Visit.findOne();
      const daily = await DailyVisit.findOne({ date: today });

      console.log("Skipping - already counted in this session");
      return res.json({
        success: true,
        total: visit ? visit.count : 0,
        today: daily ? daily.count : 0,
        message: "Already counted in this session",
      });
    }

    // Check if this is likely a refresh
    const host = req.get('host');
    const isRefresh = !referer || 
                     referer.includes(host) || 
                     referer.includes('localhost') ||
                     referer.includes('127.0.0.1');
    
    if (isRefresh && sessionId) {
      const visit = await Visit.findOne();
      const daily = await DailyVisit.findOne({ date: today });

      console.log("Skipping - appears to be a refresh (referer:", referer, ")");
      return res.json({
        success: true,
        total: visit ? visit.count : 0,
        today: daily ? daily.count : 0,
        message: "Refresh detected - not counting",
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

    // ✅ Set cookies to prevent re-counting
    const isProduction = process.env.NODE_ENV === "production";
    
    // Generate a unique session ID if not exists
    const newSessionId = req.cookies.ck_session_id || Date.now().toString() + Math.random().toString(36);
    
    // Set session cookie (longer duration)
    res.cookie("ck_session_id", newSessionId, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: isProduction ? "None" : "Lax",
      secure: isProduction,
      path: "/",
    });
    
    // Set visit counted cookie for this session
    res.cookie("ck_visit_counted", true, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: isProduction ? "None" : "Lax",
      secure: isProduction,
      path: "/",
    });

    console.log("Visit counted - Setting session cookies");
    console.log("New counts - Total:", visit.count, "Today:", dailyVisit.count);

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
