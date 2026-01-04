require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();
const PORT = 3001; // Sesuaikan port kamu

// --- IMPOR ROUTER ---
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");
const iotRoutes = require("./routes/iot"); // Impor IoT

// --- MIDDLEWARE (URUTAN INI SANGAT PENTING) ---
app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 1. Parser JSON & URL Encoded (WAJIB DI ATAS ROUTE)
// Ini membuka "amplop" data yang dikirim Arduino/Frontend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// --- ROUTES (DI BAWAH MIDDLEWARE PARSER) ---
app.get("/", (req, res) => {
  res.send("Home Page for API");
});

app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/iot", iotRoutes); // Route IoT dipasang di sini

// Error Handling untuk route yang tidak ada
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
