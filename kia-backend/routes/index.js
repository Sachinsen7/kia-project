const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const qnaRoutes = require("../modules/qna/qna.routes")
const commentRoutes = require("../modules/comments/comment.routes")


router.use("/auth", authRoutes);
router.use("/qna", qnaRoutes);
router.use("/comment", commentRoutes);


module.exports = router;