import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function DashboardPage() {
  const [user, setUser] = useState({ nama: "User", role: "-" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Proteksi: kalau gak ada token, balik ke login
    } else {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token error:", error);
        navigate("/login");
      }
    }
  }, [navigate]);

  // Implementasi Fungsi Logout sesuai soal
  const handleLogout = () => {
    localStorage.removeItem("token"); // 1. Hapus token
    navigate("/login"); // 2. Arahkan ke login
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white p-4">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Selamat Datang!
        </h1>

        <div className="my-6">
          <p className="text-gray-500 text-sm uppercase tracking-wide">
            Anda login sebagai
          </p>
          <h2 className="text-2xl font-bold text-gray-800">{user.nama}</h2>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
              user.role === "admin"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {user.role}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md transition duration-300 transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
