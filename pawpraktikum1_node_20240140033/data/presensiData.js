const presensiRecords = [
  // Data contoh awal
  {
    userId: 456,
    nama: "User Karyawan",
    checkIn: new Date("2025-10-14T08:05:00"),
    checkOut: new Date("2025-10-14T17:00:00"),
  },
  {
    userId: 101,
    nama: "Budi Santoso",
    checkIn: new Date("2025-10-14T07:55:00"), // Datang pagi
    checkOut: new Date("2025-10-14T17:05:00"),
  },
  {
    userId: 202,
    nama: "Citra Lestari",
    checkIn: new Date("2025-10-14T08:30:00"), // Agak telat
    checkOut: new Date("2025-10-14T17:30:00"),
  },
  {
    userId: 303,
    nama: "Doni Firmansyah",
    checkIn: new Date("2025-10-15T08:00:00"), // Beda hari
    checkOut: new Date("2025-10-15T16:45:00"), // Pulang lebih cepat
  },
  {
    userId: 404,
    nama: "Eka Putri",
    checkIn: new Date("2025-10-15T09:00:00"), // Telat banget
    checkOut: null, // Belum checkout
  },
  {
    userId: 505,
    nama: "Fajar Nugraha",
    checkIn: new Date("2025-10-15T07:45:00"),
    checkOut: new Date("2025-10-15T17:00:00"),
  },
];

module.exports = presensiRecords;
