"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SensorLog extends Model {
    static associate(models) {
      // define association here
    }
  }

  SensorLog.init(
    {
      suhu: DataTypes.FLOAT,
      kelembaban: DataTypes.FLOAT,
      cahaya: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SensorLog", // Nama Model (Untuk dipanggil di Controller)

      // PENTING: Berdasarkan screenshotmu, nama tabelnya adalah 'sensorlogs' (jamak)
      // Jika ternyata di phpMyAdmin tulisannya 'sensorlog' (tanpa s), hapus huruf 's' di bawah ini.
      tableName: "sensorlogs",
      freezeTableName: true, // Mencegah Sequelize mengubah nama tabel secara otomatis
      timestamps: true, // Mengaktifkan createdAt dan updatedAt
    }
  );

  return SensorLog;
};
