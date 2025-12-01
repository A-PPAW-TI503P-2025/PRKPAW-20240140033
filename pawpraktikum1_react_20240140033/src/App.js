import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage.js";
import RegisterPage from "./components/RegisterPage.js";
import DashboardPage from "./components/DashboardPage.js";
import AttendancePage from "./components/AttendancePage.js";
import Navbar from "./components/Navbar.js";
import ReportPage from "./components/ReportPage.js";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />{" "}
        {/* Tambahin ini */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/presensi" element={<AttendancePage />} />
        <Route path="/reports" element={<ReportPage />} />{" "}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
