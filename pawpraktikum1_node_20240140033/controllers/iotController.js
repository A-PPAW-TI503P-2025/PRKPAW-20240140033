// 1. Import Model diletakkan PALING ATAS
// Pastikan menggunakan 'SensorLog' (S Besar) sesuai dengan nama class di file model tadi
const { SensorLog } = require("../models");

exports.testConnection = (req, res) => {
  const { message, deviceId } = req.body;
  console.log(`📡 [IOT] Pesan dari ${deviceId}: ${message}`);
  res.status(200).json({ status: "ok", reply: "Server menerima koneksi!" });
};

exports.getSensorHistory = async (req, res) => {
  try {
    // Ambil 20 data terakhir
    const data = await SensorLog.findAll({
      limit: 20,
      order: [["createdAt", "DESC"]],
    });

    // Balik urutan untuk grafik (Lama -> Baru)
    const formattedData = data.reverse();

    res.json({
      status: "success",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error getHistory:", error); // Log error ke terminal
    res.status(500).json({ error: error.message });
  }
};

exports.receiveSensorData = async (req, res) => {
  try {
    const { suhu, kelembaban, cahaya } = req.body;

    // Validasi input
    if (suhu === undefined || kelembaban === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Data suhu atau kelembaban tidak valid",
      });
    }

    // Simpan ke Database menggunakan Model SensorLog
    await SensorLog.create({
      suhu: parseFloat(suhu),
      kelembaban: parseFloat(kelembaban),
      cahaya: parseInt(cahaya) || 0,
    });

    console.log(
      `💾 [SAVED] Suhu: ${suhu}°C | Lembab: ${kelembaban}% | Cahaya: ${cahaya}`
    );

    res.status(201).json({ status: "ok", message: "Data berhasil disimpan" });
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
