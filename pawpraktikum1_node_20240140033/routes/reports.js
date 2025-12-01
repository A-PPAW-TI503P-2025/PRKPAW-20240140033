const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const {
  authenticateToken,
  isAdmin,
} = require("../middleware/permissionMiddleware");

// --- DEBUGGING (Agar kita tau kalau ada yang null) ---
if (!authenticateToken || !isAdmin) {
  console.error(
    "❌ FATAL ERROR: Middleware tidak terbaca di routes/reports.js"
  );
  console.error("Pastikan file middleware/permissionMiddleware.js tersimpan.");
}

// 1. Pasang Middleware Auth (Wajib Login)
// Ini yang bikin error baris 18 sebelumnya kalau authenticateToken undefined
if (typeof authenticateToken === "function") {
  router.use(authenticateToken);
}

// 2. Pasang Middleware Admin (Wajib Admin)
if (typeof isAdmin === "function") {
  router.use(isAdmin);
}

// 3. Pasang Route Laporan
// Cek apakah controllernya ada
if (reportController && reportController.getDailyReport) {
  router.get("/daily", reportController.getDailyReport);
  router.get("/", reportController.getDailyReport);
} else {
  // Route dummy biar ga crash kalau controller belum siap
  router.get("/", (req, res) =>
    res.json({ message: "Controller Laporan belum siap" })
  );
}

module.exports = router;
