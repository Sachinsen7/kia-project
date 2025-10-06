const Visit = require("../modules/websiteVisit/visit.model");
const jwt = require("jsonwebtoken");

const cookieTracker = async (req, res, next) => {
  try {
    // Just set the IP cookie for tracking, don't do visit counting here
    // Visit counting should only happen in the dedicated API endpoint
    res.cookie("ck_visit_ip", req.ip, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "Lax",
      path: "/",
    });

    next();
  } catch (err) {
    console.error("Cookie tracker error:", err.message);
    next();
  }
};

module.exports = cookieTracker;


