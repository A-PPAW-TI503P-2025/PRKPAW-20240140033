const { Presensi } = require("../models");
const { Op } = require("sequelize");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// UPLOAD FOTO

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// 2. Filter khusus gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan!"), false);
  }
};

exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});


exports.CheckIn = async (req, res) => {
  try {
    // 1. Validasi User
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Sesi tidak valid, silakan login ulang." });
    }
    const userId = req.user.id;

    const { latitude, longitude } = req.body;

    const buktiFoto = req.file ? req.file.path : null;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Lokasi tidak terdeteksi. Pastikan GPS aktif." });
    }

    const waktuSekarang = new Date();

    const activeSession = await Presensi.findOne({
      where: {
        userId: userId,
        checkOut: null,
      },
    });

    if (activeSession) {
      return res.status(400).json({
        message:
          "Anda masih dalam sesi Check-In. Silakan Check-Out terlebih dahulu.",
      });
    }

    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      latitude: latitude,
      longitude: longitude,
      buktiFoto: buktiFoto, // Simpan path foto
    });

    const formattedData = {
      userId: newRecord.userId,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      checkOut: null,
      buktiFoto: newRecord.buktiFoto,
    };

    res.status(201).json({
      message: `Halo, check-in berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    console.error("CheckIn Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Sesi tidak valid." });
    }

    const userId = req.user.id;
    const waktuSekarang = new Date();

    // Cari Sesi Aktif
    const recordToUpdate = await Presensi.findOne({
      where: {
        userId: userId,
        checkOut: null,
      },
      order: [["checkIn", "DESC"]],
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message:
          "Anda belum melakukan Check-In atau sesi sebelumnya sudah selesai.",
      });
    }

    // Update Data
    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
    };

    res.json({
      message: `Selamat jalan, check-out berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    console.error("CheckOut Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.deletePresensi = async (req, res) => {};
exports.updatePresensi = async (req, res) => {};
