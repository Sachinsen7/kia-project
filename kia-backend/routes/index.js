const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");


router.post("/auth", authRoutes);


module.exports = router;