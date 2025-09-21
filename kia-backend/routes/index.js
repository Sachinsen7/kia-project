const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const qnaRoutes = require("../modules/qna/qna.routes")
const commentRoutes = require("../modules/comments/comment.routes")
const uploadRoutes = require("../modules/uploads/upload.routes")
const linkRoutes = require("../modules/links/link.routes")


router.use("/auth", authRoutes);
router.use("/qna", qnaRoutes);
router.use("/comment", commentRoutes);
router.use('/uploads', uploadRoutes);
router.use('/link', linkRoutes);


module.exports = router;