const express = require("express");
const router = express.Router();
const { incrementVisit, getVisitCount, getTodayVisits, getRecentDailyVisits } = require("./visit.controller");

// Routes
router.get("/hit", incrementVisit);
router.get("/count", getVisitCount);
router.get("/today", getTodayVisits);
router.get("/daily", getRecentDailyVisits);

module.exports = router;
