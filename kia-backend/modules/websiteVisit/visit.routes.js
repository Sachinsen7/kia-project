const express = require("express");
const router = express.Router();
const {
    incrementVisit,
    getVisitCount,
    getTodayVisits,
    getRecentDailyVisits,
    getAllVisits,
} = require("./visit.controller");

// Routes
router.post("/hit", incrementVisit);          // increments & returns counts
router.get("/count", getVisitCount);         // total visits only
router.get("/today", getTodayVisits);        // today's visits only
router.get("/daily", getRecentDailyVisits);  // recent N days (analytics)
router.get("/stats", getAllVisits);          // combined total + today

module.exports = router;
