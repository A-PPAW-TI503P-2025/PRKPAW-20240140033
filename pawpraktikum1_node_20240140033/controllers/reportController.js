const { Presensi } = require("../models");
exports.getDailyReport = async(req, res) => {
  try {
    //get all presensi data
    const presensiData = await Presensi.findAll();
    res.status(200).json({
      status: "success",
      data: presensiData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data presensi",
      error: error.message,
    });
  }
};
