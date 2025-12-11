// src/Components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { AiOutlineSearch } from "react-icons/ai";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
// import the popup CSS provided earlier

export default function Navbar({ onMenuClick, onSearchResults, apiBase = "http://localhost:2000" }) {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef();


  function handleChannel() {
    // toggle popup
    setMenuOpen((v) => !v);
  }
  
const navigate = useNavigate();

  // fetch current user (if no initial user provided)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/me`, { credentials: "include" });
        if (!res.ok) return; // not signed in
        const json = await res.json();
        if (mounted && json?.user) setUser(json.user);
      } catch (err) {
        // ignore
      }
    })();
    return () => (mounted = false);
  }, [apiBase]);

  // close menu on outside click or Esc
  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const normalizeArray = (result) => {
    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result.videos)) return result.videos;
    const arr = Object.values(result).find((v) => Array.isArray(v));
    return Array.isArray(arr) ? arr : [];
  };

  const handleSearch = async () => {
    try {
      const q = (query || "").trim();
      console.log("[Navbar] Searching for:", q);
      const url = `${apiBase}/api/data/search?title=${encodeURIComponent(q)}`;
      const res = await fetch(url, { method: "GET" });
      console.log("[Navbar] Response status:", res.status);
      if (!res.ok) {
        const text = await res.text();
        console.error("[Navbar] Server error body:", text);
        throw new Error(`Server returned ${res.status}`);
      }
      const json = await res.json();
      const arr = normalizeArray(json);
      if (onSearchResults) onSearchResults(arr);
    } catch (err) {
      console.error("[Navbar] Search error:", err);
      if (onSearchResults) onSearchResults([]); // send empty on failure
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  function handleViewChannel(e) {
  e.preventDefault();
  setMenuOpen(false);
  if (user?.id || user?._id) {
    const id = user?.id || user?._id;
    navigate(`/channel/${id}`);
  } else {
    navigate("/login");
  }
}

  const avatarSrc = user?.avatarUrl || "https://i.pravatar.cc/40";
  const displayName = user?.displayName || "Guest";
  const handle = user?.handle ? `@${user.handle}` : "";

  return (
    <header className="yt-navbar">
      <div className="yt-left">
        <button className="yt-icon-btn menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <IoMenu size={20} />
        </button>

        <div className="yt-logo">
          <svg className="yt-logo-icon" viewBox="0 0 24 24" aria-hidden>
            <path fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3 12 3 12 3s-7.5 0-9.4.9A3 3 0 0 0 .5 6.2C0 8.2 0 12 0 12s0 3.8.5 5.8a3 3 0 0 0 2.1 2.1C4.5 21 12 21 12 21s7.5 0 9.4-.9a3 3 0 0 0 2.1-2.1c.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8z"/>
            <path fill="#fff" d="M9.6 15.5V8.5l6.6 3.5-6.6 3.5z"/>
          </svg>
          <span className="yt-logo-text">YouTube <small>IN</small></span>
        </div>
      </div>

      <div className="yt-center">
        <div className="yt-search-bar">
          <input
            className="yt-search-input"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Search"
          />
          <button className="yt-search-btn" aria-label="Search" onClick={handleSearch}>
            <AiOutlineSearch size={18} />
          </button>
        </div>
      </div>

      <div className="yt-right" ref={menuRef} style={{ position: "relative" }}>
        <img
          src={avatarSrc}
          alt="profile"
          className="yt-avatar"
          onClick={handleChannel}
          style={{ cursor: "pointer" }}
        />

        {menuOpen && (
          <div className="aam-popup" role="menu" aria-label="Account menu" style={{ right: 0, position: "absolute", top: "calc(100% + 8px)" }}>
            <div className="aam-header">
              
              <div className="aam-header-info">
                <div className="aam-name">{displayName}</div>
               
               <button
                    type="button"
                    className="aam-view-channel"
                    onClick={handleViewChannel}
                    aria-label="View your channel"
                    >
                       View your channel
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </header>
  );
}

