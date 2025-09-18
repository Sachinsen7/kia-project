const express = require("express");
const router = express.Router;
const {createQna, deleteQna, getAllQna, toggleLike} = require("./qna.controller");


router.post("/", createQna);
router.get("/", getAllQna);
router.post("/:id/like", toggleLike);
router.delete("/:id", deleteQna);

module.exports = router;