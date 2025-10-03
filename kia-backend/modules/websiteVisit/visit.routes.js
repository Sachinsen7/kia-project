const express = require("express");
const router = express.Router();
const { incrementVisit, getVisitCount } = require("./visit.controller");

// Routes
router.get("/hit", incrementVisit);
router.get("/count", getVisitCount);

module.exports = router;
