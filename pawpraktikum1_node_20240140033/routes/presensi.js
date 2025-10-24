const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { addUserData } = require("../middleware/permissionMiddleware");
router.use(addUserData);
router.post("/check-in", presensiController.CheckIn);
router.post("/check-out", presensiController.CheckOut);

// Tambahkan ini di dalam file routes/presensi.js
router.post('/', (req, res) => {
    console.log("Request body:", req.body);
    res.status(201).json({ message: "Presensi berhasil dicatat!" });
});

// Tambahkan ini juga jika belum ada
router.get('/', (req, res) => {
    // Nanti di sini bisa diisi logika untuk mengambil data dari database
    res.status(200).json({ message: "Ini adalah endpoint untuk GET semua data presensi" });
});

router.get("/check-in", (req, res) => {
  // Logika untuk handle check-in ada di sini
  // Untuk sekarang, kita kirim pesan sukses aja
  res.status(200).json({
    status: "success",
    message: "Endpoint untuk presensi check-in berhasil diakses!",
  });
});

module.exports = router;
