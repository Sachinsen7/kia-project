const express = require("express");
const router = express.Router();
const { addComment, getComments, deleteComment } = require("./comment.controller");
const authMiddleware = require("../../middleware/authMiddleware");

// Comment routes
router.post("/:qnaId", authMiddleware, addComment);  // add comment to QnA
router.get("/:qnaId", getComments);                 // get all comments for QnA
router.delete("/:id", authMiddleware, deleteComment); // delete comment

module.exports = router;
