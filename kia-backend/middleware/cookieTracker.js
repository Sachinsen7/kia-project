const Visit = require("../modules/websiteVisit/visit.model");
const jwt = require("jsonwebtoken");

const cookieTracker = async (req, res, next) => {
  try {
    const isLoggedIn = req.cookies.PHPSESSID ? true : false;

    // Refresh ck_visit_ip daily for everyone
    res.cookie("ck_visit_ip", req.ip, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "Lax",
    });

    // Skip counting if already counted today
    if (req.cookies.ck_visit_ip_counted) {
      return next();
    }

    // Skip counting for logged-in users (optional, avoids inflating visit count)
    if (isLoggedIn) {
      return next();
    }

    // Increment visit count for new visitors
    let visit = await Visit.findOne();
    if (!visit) {
      visit = new Visit({ count: 1 });
    } else {
      visit.count += 1;
    }
    await visit.save();

    // Set cookie to mark counted today
    res.cookie("ck_visit_ip_counted", true, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "Lax",
    });

    next();
  } catch (err) {
    console.error("Cookie tracker error:", err.message);
    next();
  }
};

module.exports = cookieTracker;
