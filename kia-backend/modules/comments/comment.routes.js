const express = require("express");
const router = express.Router();
const { addComment, getComments, deleteComment } = require("./comment.controller");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/:qnaId", authMiddleware, addComment);  
router.get("/:qnaId", getComments);                 
router.delete("/:id", authMiddleware, deleteComment); 

module.exports = router;
