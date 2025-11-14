const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN";

// Registrasi User
exports.register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;
    
    // Validasi input kosong
    if (!nama || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nama, email, dan password harus diisi" });
    }

    // Validasi role
    if (role && !["mahasiswa", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role tidak valid. Harus 'mahasiswa' atau 'admin'." });
    }

    // Hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user ke database
    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: role || "mahasiswa",
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      data: { id: newUser.id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    // error kalo email udah dipake
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    // cek password 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah." });
    }

    // buat token JWT
    const payload = {
      id: user.id,
      nama: user.nama,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login berhasil",
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
