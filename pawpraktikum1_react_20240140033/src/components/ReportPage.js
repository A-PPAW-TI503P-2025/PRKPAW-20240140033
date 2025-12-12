import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth.js";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal Foto
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  // State untuk filter
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReports = async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          nama: searchName,
          tanggalMulai: startDate,
          tanggalSelesai: endDate,
        },
      };

      const response = await axios.get(
        "http://localhost:3001/api/reports/daily",
        config
      );

      setReports(response.data.data || []);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        setError("Akses Ditolak: Halaman ini khusus Admin.");
      } else {
        setError(
          err.response ? err.response.data.message : "Gagal mengambil data."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports();
  };

  // Helper untuk membuat URL Gambar yang valid
  const getImageUrl = (path) => {
    if (!path) return null;
    // backslash (\) diganti jadi slash (/) untuk kompatibilitas Windows
    const cleanPath = path.replace(/\\/g, "/");
    return `http://localhost:3001/${cleanPath}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return (
      new Date(dateString).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }) + " WIB"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      {/* --- MODAL / POPUP FOTO --- */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)} // Klik background untuk tutup
        >
          <div className="relative bg-white p-2 rounded-lg max-w-4xl max-h-full overflow-auto">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 -mt-4 -mr-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-red-700 shadow-lg"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Bukti Full"
              className="max-h-[85vh] object-contain rounded"
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4">
            Dashboard Laporan Presensi
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            &larr; Kembali ke Dashboard
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cari Nama
              </label>
              <input
                type="text"
                placeholder="Contoh: Fannandya"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2"
            >
              Filter Data
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border-l-4 border-red-500 mb-6 shadow-sm">
            <p className="font-bold">Terjadi Kesalahan</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Memuat data laporan...</p>
          </div>
        ) : (
          /* Table Section */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Nama Karyawan
                    </th>
                    {/* KOLOM BARU */}
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Bukti Foto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Jam Masuk
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Jam Keluar
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.length > 0 ? (
                    reports.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-blue-50 transition duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                              {item.user
                                ? item.user.nama.charAt(0).toUpperCase()
                                : "?"}
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.user
                                ? item.user.nama
                                : "User Tidak Dikenal"}
                            </div>
                          </div>
                        </td>

                        {/* --- ISI KOLOM FOTO --- */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.buktiFoto ? (
                            <img
                              src={getImageUrl(item.buktiFoto)}
                              alt="Bukti"
                              className="h-12 w-12 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80 transition"
                              onClick={() =>
                                setSelectedImage(getImageUrl(item.buktiFoto))
                              }
                            />
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              No Foto
                            </span>
                          )}
                        </td>
                        {/* ---------------------- */}

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(item.checkIn)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {formatTime(item.checkIn)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.checkOut ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {formatTime(item.checkOut)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400 italic">
                              -- : --
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.checkOut ? (
                            <span className="text-xs font-bold text-green-600 border border-green-200 px-2 py-1 rounded">
                              Selesai
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-yellow-600 border border-yellow-200 px-2 py-1 rounded">
                              Sedang Bekerja
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        <p className="text-lg font-medium">
                          Data tidak ditemukan
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;
