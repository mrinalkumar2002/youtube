// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Navbar/Sidebar";
import VideoPage from "./Pages/VideoPage";
import PagenotFound from "./Pages/PagenotFound";
import Channelpage from "./Pages/Channelpage";
import ProtectedRoute from "./Components/ProtectedRoute";

export const serverUrl = "http://localhost:2000";

function App() {
  // single source of truth for sidebar collapsed state
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  // Keep the body class in sync so your CSS selectors work:
  // body.sidebar-collapsed .homepage-root { margin-left: var(--sidebar-width-collapsed); }
   useEffect(() => {
    if (collapsed) {
      document.body.classList.add("sidebar-collapsed");
      document.documentElement.style.setProperty("--sidebar-width", "80px");
    } else {
      document.body.classList.remove("sidebar-collapsed");
      document.documentElement.style.setProperty("--sidebar-width", "240px");
    }
  }, [collapsed]);

  // check auth once per render — ProtectedRoute will also guard routes
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <>
      {/* Navbar should call onMenuClick when user clicks menu/hamburger */}
      <Navbar onMenuClick={toggleSidebar} />

      {/* Sidebar receives the collapsed prop (so it can render collapsed UI) */}
      <Sidebar collapsed={collapsed} />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home collapsed={collapsed} />} />
        <Route path="/video/:videoId" element={<VideoPage collapsed={collapsed} />} />
        <Route path="*" element={<PagenotFound />} />
          <Route
    path="/channel/:id"
    element={
      <ProtectedRoute>
        <Channelpage />
      </ProtectedRoute>
    }
  />
      </Routes>
    </>
  );
}

export default App;


