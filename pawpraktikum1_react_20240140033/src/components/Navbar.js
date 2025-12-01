import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); // Reset state user
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
      <div className="font-bold text-xl">Sistem Presensi</div>

      <div className="flex gap-4 items-center">
        {/* LOGIKA KONDISIONAL: Cek apakah user sudah login? */}

        {user ? (
          <>
            <span className="text-sm bg-blue-700 px-2 py-1 rounded">
              Halo, {user.nama}
            </span>

            <Link to="/dashboard" className="hover:text-blue-200 font-medium">
              Dashboard
            </Link>

            <Link to="/presensi" className="hover:text-blue-200 font-medium">
              Presensi
            </Link>

            {/* Menu Laporan hanya untuk Admin */}
            {user.role === "admin" && (
              <Link to="/reports" className="hover:text-blue-200 font-bold">
                Laporan
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          // ==========================================
          // TAMPILAN JIKA BELUM LOGIN (Guest Menu)
          // ==========================================
          <>
            <Link to="/login" className="hover:text-blue-200 font-medium">
              Login
            </Link>

            <Link
              to="/register"
              className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition duration-300 font-medium"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
