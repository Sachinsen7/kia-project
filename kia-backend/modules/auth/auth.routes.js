const express = require("express");
const router = express.Router();
const { signUp, login, universalLogin } = require("./auth.controller");
const {
  forgotPassword,
  resetPassword,
  verifyResetCode,
  setPassword,
} = require("../PasswordReset/PasswordReset.controller copy");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/universal-login", universalLogin);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.post("/set-password", setPassword);

module.exports = router;
