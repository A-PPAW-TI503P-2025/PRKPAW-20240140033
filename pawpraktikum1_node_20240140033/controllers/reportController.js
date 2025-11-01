const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async(req, res) => {
    try {
      const { nama, tanggalMulai, tanggalSelesai } = req.query;
      let options = {where: {} };

      if (nama) {
        options.where.nama = { [Op.like]: `%${nama}%` };
      };

      if (tanggalMulai && tanggalSelesai) {
        options.where.createdAt = {
          [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)],
        };
      }

      const records = await Presensi.findAll(options);
      res.json({
        reportDate: new Date().toLocaleDateString(),
        data: records,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server", error: error.message });
    } 
};