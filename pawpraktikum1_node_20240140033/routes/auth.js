const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

if (!authController || !authController.login) {
  console.error("ERROR: authController atau fungsi login tidak ditemukan");
}

// Route untuk registrasi dan login
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
