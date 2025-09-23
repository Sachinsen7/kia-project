const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  loginAdmin,
  approveUser,
  declineUser,
} = require("./admin.controller");
const adminMiddleware = require("../../middleware/adminMiddleware");

router.post("/login", loginAdmin);
router.get("/all", adminMiddleware, getAllUsers);
router.patch("/approve/:userId", adminMiddleware, approveUser);
router.patch("/decline/:userId", adminMiddleware, declineUser);

module.exports = router;
    