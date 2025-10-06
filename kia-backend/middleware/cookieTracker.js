const Visit = require("../modules/websiteVisit/visit.model");
const jwt = require("jsonwebtoken");

const cookieTracker = async (req, res, next) => {
  try {
    // Set the IP cookie for tracking
    res.cookie("ck_visit_ip", req.ip, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "Lax",
      path: "/",
    });

    // Set session ID if not exists (for tracking refreshes)
    if (!req.cookies.ck_session_id) {
      const sessionId = Date.now().toString() + Math.random().toString(36);
      res.cookie("ck_session_id", sessionId, {
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "Lax",
        path: "/",
      });
    }

    next();
  } catch (err) {
    console.error("Cookie tracker error:", err.message);
    next();
  }
};

module.exports = cookieTracker;


