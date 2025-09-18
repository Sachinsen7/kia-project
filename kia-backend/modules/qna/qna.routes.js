const express = require("express");
const router = express.Router();
const {createQna, deleteQna, getAllQna, toggleLike} = require("./qna.controller");
const authMiddlewares = require("../../middleware/authMiddleware")


router.post("/", authMiddlewares, createQna);
router.get("/", getAllQna);
router.post("/:id/like", authMiddlewares, toggleLike);
router.delete("/:id" , authMiddlewares, deleteQna);

module.exports = router;