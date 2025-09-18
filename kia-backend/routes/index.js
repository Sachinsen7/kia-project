const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const qnaRoutes = require("../modules/qna/qna.routes")


router.use("/auth", authRoutes);
router.use("/qna", qnaRoutes);


module.exports = router;