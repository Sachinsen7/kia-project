const express = require("express");
const router = express.Router();
const { incrementVisit, getVisitCount } = require("./visit.controller");

router.get("/hit", incrementVisit);      // Call this whenever someone visits
router.get("/count", getVisitCount);     // Get total visits

module.exports = router;
