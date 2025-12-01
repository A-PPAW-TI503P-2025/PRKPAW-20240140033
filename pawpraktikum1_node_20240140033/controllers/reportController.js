const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    let options = {
      include: [
        {
          model: User,
          as: "user", // Ini sekarang akan COCOK dengan model di atas
          attributes: ["nama", "email"],
        },
      ],
      where: {},
      order: [["checkIn", "DESC"]],
    };

    // Filter Cari Nama (Lewat Relasi User)
    if (nama) {
      options.include[0].where = {
        nama: { [Op.like]: `%${nama}%` },
      };
    }

    // Filter Tanggal
    if (tanggalMulai && tanggalSelesai) {
      // Saran: Gunakan 'checkIn' agar lebih relevan daripada 'createdAt'
      options.where.checkIn = {
        [Op.between]: [
          new Date(tanggalMulai + " 00:00:00"),
          new Date(tanggalSelesai + " 23:59:59"),
        ],
      };
    }

    const records = await Presensi.findAll(options);

    res.status(200).json({
      status: "success",
      data: records,
    });
  } catch (error) {
    console.error("Error getDailyReport:", error);
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
