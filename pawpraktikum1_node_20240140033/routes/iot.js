const express = require("express");
const router = express.Router();

// Import Controller
const iotController = require("../controllers/iotController");

// Cek koneksi
router.post("/ping", iotController.testConnection);

// Terima data (Hanya satu baris, jangan duplikat)
router.post("/data", iotController.receiveSensorData);

// Ambil history
router.get("/history", iotController.getSensorHistory);

module.exports = router;
