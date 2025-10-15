const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  loginAdmin,
  approveUser,
  declineUser,
} = require("./admin.controller");
const { seedUsersFromFile } = require("./seed.controller");
const adminMiddleware = require("../../middleware/adminMiddleware");
const upload = require("../../config/multer");

router.post("/login", loginAdmin);
router.get("/all", adminMiddleware, getAllUsers);
router.patch("/approve/:userId", adminMiddleware, approveUser);
router.patch("/decline/:userId", adminMiddleware, declineUser);
router.post("/seed-users", adminMiddleware, upload.single('file'), seedUsersFromFile);

module.exports = router;
    