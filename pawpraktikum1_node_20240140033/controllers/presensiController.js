const { Presensi } = require("../models");
const { Op } = require("sequelize");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.CheckIn = async (req, res) => {
  try {
    // 1. Validasi User & Lokasi
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Sesi tidak valid, silakan login ulang." });
    }
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Lokasi tidak terdeteksi. Pastikan GPS aktif." });
    }

    const waktuSekarang = new Date();

    // 2. LOGIKA BARU: Cek Sesi Aktif (Bukan Cek Harian)
    // Cari data user ini yang kolom checkOut-nya masih KOSONG (null)
    const activeSession = await Presensi.findOne({
      where: {
        userId: userId,
        checkOut: null, // Artinya dia masih "sedang bekerja"
      },
    });

    // Jika ada sesi aktif, tolak check-in baru
    if (activeSession) {
      return res
        .status(400)
        .json({
          message:
            "Anda masih dalam sesi Check-In. Silakan Check-Out terlebih dahulu.",
        });
    }

    // 3. Simpan Check-In Baru
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      latitude: latitude,
      longitude: longitude,
    });

    const formattedData = {
      userId: newRecord.userId,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      checkOut: null,
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

    // 1. Cari Sesi yang Belum Selesai (CheckOut masih null)
    const recordToUpdate = await Presensi.findOne({
      where: {
        userId: userId,
        checkOut: null, // Cari yang statusnya masih aktif
      },
      order: [["checkIn", "DESC"]], // Ambil yang paling baru (jaga-jaga)
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message:
          "Anda belum melakukan Check-In atau sesi sebelumnya sudah selesai.",
      });
    }

    // 2. Update Data
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

// ... fungsi lain biarkan saja
exports.deletePresensi = async (req, res) => {};
exports.updatePresensi = async (req, res) => {};
