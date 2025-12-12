import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { getToken } from "../utils/auth.js";

// --- 1. Import Komponen Peta ---
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- 2. Fix Icon Marker Leaflet ---
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

  // State untuk Peta & Foto
  const [mapPosition, setMapPosition] = useState(null);
  const [image, setImage] = useState(null);

  const webcamRef = useRef(null);

  // --- Fungsi Ambil Foto ---
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // --- Fungsi Ambil Lokasi ---
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
    setMapPosition(null);

    const token = getToken();
    if (!token) {
      setError("Token tidak valid, silakan login ulang.");
      setLoading(false);
      return;
    }

    // Validasi Khusus Check-In: Wajib Ada Foto
    if (type === "check-in" && !image) {
      setError("Wajib ambil foto selfie untuk Check-In!");
      setLoading(false);
      return;
    }

    try {
      // 1. Ambil Lokasi
      const location = await getLocation();

      // 2. Siapkan Data (FormData untuk upload foto)
      let requestData;
      let headers = { Authorization: `Bearer ${token}` };

      if (type === "check-in") {
        // Kalau Check-In: Kirim FormData (Gambar + Lokasi)
        const blob = await (await fetch(image)).blob();
        const formData = new FormData();
        formData.append("latitude", location.lat);
        formData.append("longitude", location.lon);
        formData.append("image", blob, "selfie.jpg"); // Sesuaikan key 'image' dengan backend multer

        requestData = formData;
        // Axios otomatis set Content-Type multipart/form-data kalau data-nya FormData
      } else {
        // Kalau Check-Out: Kirim JSON biasa (Lokasi aja)
        requestData = {
          latitude: location.lat,
          longitude: location.lon,
        };
      }

      const url =
        type === "check-in"
          ? "http://localhost:3001/api/presensi/check-in"
          : "http://localhost:3001/api/presensi/check-out";

      // 3. Kirim Request
      const response = await axios.post(url, requestData, { headers });

      setMessage(response.data.message);

      // Tampilkan Peta setelah sukses
      setMapPosition([location.lat, location.lon]);

      // Reset foto setelah sukses check-in
      if (type === "check-in") setImage(null);
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Lakukan Presensi
        </h2>

        {/* --- Bagian Webcam (Khusus sebelum Check-In) --- */}
        {!mapPosition && (
          <div className="mb-6">
            <div className="rounded-lg overflow-hidden border-2 border-gray-300 bg-black mb-4">
              {image ? (
                <img
                  src={image}
                  alt="Selfie"
                  className="w-full h-64 object-cover"
                />
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-64 object-cover"
                  videoConstraints={{ facingMode: "user" }}
                />
              )}
            </div>

            {image ? (
              <button
                onClick={() => setImage(null)}
                className="text-sm text-blue-600 underline"
              >
                Foto Ulang
              </button>
            ) : (
              <button
                onClick={capture}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
              >
                Ambil Foto
              </button>
            )}
          </div>
        )}

        {loading && (
          <p className="text-blue-500 mb-4 font-semibold animate-pulse">
            Memproses...
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

        {/* --- Tampilkan Peta Hanya Jika Berhasil --- */}
        {mapPosition && (
          <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-blue-200 shadow-inner animate-fade-in">
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
                <Popup>Lokasi Presensi Anda</Popup>
              </Marker>
            </MapContainer>
            <p className="text-xs text-gray-500 mt-2">
              Lokasi & Foto Berhasil Dikirim
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
