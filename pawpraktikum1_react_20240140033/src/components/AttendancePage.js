import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth.js";

// --- 1. Import Komponen Peta ---
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Wajib import CSS ini
import L from "leaflet"; // Import Leaflet core untuk fix icon

// --- 2. Fix Icon Marker yang Hilang (Bug bawaan Leaflet di React) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // State baru untuk menyimpan posisi peta setelah sukses
  const [mapPosition, setMapPosition] = useState(null);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Browser tidak mendukung Geolocation"));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (err) => {
            reject(new Error("Gagal mengambil lokasi. Pastikan GPS aktif."));
          }
        );
      }
    });
  };

  const handleAction = async (type) => {
    setMessage("");
    setError("");
    setLoading(true);
    setMapPosition(null); // Reset peta setiap kali tombol ditekan

    const token = getToken();
    if (!token) {
      setError("Token tidak valid, silakan login ulang.");
      setLoading(false);
      return;
    }

    try {
      const location = await getLocation();

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const url =
        type === "check-in"
          ? "http://localhost:3001/api/presensi/check-in"
          : "http://localhost:3001/api/presensi/check-out";

      const response = await axios.post(
        url,
        {
          latitude: location.lat,
          longitude: location.lon,
        },
        config
      );

      setMessage(response.data.message);

      // --- 3. Set Posisi Peta jika Berhasil ---
      setMapPosition([location.lat, location.lon]);
    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes("GPS")) {
        setError(err.message);
      } else {
        setError(
          err.response ? err.response.data.message : "Gagal terhubung ke server"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Lakukan Presensi
        </h2>

        {loading && (
          <p className="text-blue-500 mb-4 font-semibold animate-pulse">
            Mendeteksi lokasi...
          </p>
        )}
        {message && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleAction("check-in")}
            disabled={loading}
            className={`w-full py-3 px-4 text-white font-semibold rounded-md shadow-sm transition ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Check-In
          </button>

          <button
            onClick={() => handleAction("check-out")}
            disabled={loading}
            className={`w-full py-3 px-4 text-white font-semibold rounded-md shadow-sm transition ${
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Check-Out
          </button>
        </div>

        {/* --- 4. Tampilkan Peta Hanya Jika mapPosition Ada --- */}
        {mapPosition && (
          <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-blue-200 shadow-inner">
            <MapContainer
              center={mapPosition}
              zoom={16}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={mapPosition}>
                <Popup>Lokasi Anda saat presensi.</Popup>
              </Marker>
            </MapContainer>
            <p className="text-xs text-gray-500 mt-2">Lokasi Terdeteksi</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
