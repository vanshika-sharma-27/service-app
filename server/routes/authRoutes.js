const express = require("express");
const router = express.Router();

const { register, login, googleLogin, forgotPassword } = require("../controllers/authController");

router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);

router.post("/register", register);
router.post("/login", login);

module.exports = router;