const express = require("express");
const router = express.Router();
const { addLink, getAllLinks, deleteLink } = require("./link.controller");
const authMiddleware = require("../../middleware/authMiddleware");

// Link routes
router.post("/", authMiddleware, addLink);
router.get("/", authMiddleware, getAllLinks);
router.delete("/:id", authMiddleware, deleteLink);

module.exports = router;
