// src/Navbar/Sidebar.jsx
import React from "react";
import { SlHome } from "react-icons/sl";
import { SiYoutubeshorts } from "react-icons/si";
import { MdSubscriptions, MdOutlineVideoLibrary, MdOutlineWatchLater, MdOutlineHistory, MdThumbUp, MdOutlineExplore, MdOutlineSettings } from "react-icons/md";
import { GiFilmSpool } from "react-icons/gi";
import "./Sidebar.css";
import { useNavigate } from "react-router";

export default function Sidebar({ collapsed = false }) {
  const navigate=useNavigate()
   function handlehome(){
    navigate("/")
   }

  const topItems = [
    { icon: <SlHome />, label: "Home", key: "home" },
    { icon: <SiYoutubeshorts />, label: "Shorts", key: "shorts" },
    { icon: <MdSubscriptions />, label: "Subscriptions", key: "subscriptions" },
  ];

  const libraryItems = [
    { icon: <MdOutlineVideoLibrary />, label: "Library", key: "library" },
    { icon: <MdOutlineHistory />, label: "History", key: "history" },
    { icon: <GiFilmSpool />, label: "Your videos", key: "your-videos" },
    { icon: <MdOutlineWatchLater />, label: "Watch later", key: "watch-later" },
    { icon: <MdThumbUp />, label: "Liked videos", key: "liked" },
  ];

  const exploreItems = [
    { icon: <MdOutlineExplore />, label: "Trending", key: "trending" },
    { icon: <MdOutlineExplore />, label: "Music", key: "music" },
    { icon: <MdOutlineExplore />, label: "Gaming", key: "gaming" },
  ];

  const settingsItems = [
    { icon: <MdOutlineSettings />, label: "Settings", key: "settings" },
    { icon: "❓", label: "Help", key: "help" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} >
      <div className="sidebar-top-row" aria-hidden>
        {/* empty row */}
      </div>

      <nav className="side-section side-top" aria-label="Top">
        {topItems.map(it => (
          <div key={it.key} className="side-item" role="link" tabIndex={0} >
            <span className="side-icon" onClick={handlehome}>{it.icon}</span>
            <span className="side-text" onClick={handlehome}>{it.label}</span>
          </div>
        ))}
      </nav>

      <hr className="divider" />

      <nav className="side-section side-library" aria-label="Library">
        {libraryItems.map(it => (
          <div key={it.key} className="side-item" role="link" tabIndex={0}>
            <span className="side-icon">{it.icon}</span>
            <span className="side-text">{it.label}</span>
          </div>
        ))}
      </nav>

      <hr className="divider" />

      <div className="side-section side-explore" aria-label="Explore">
        <div className="section-title"></div>
        {exploreItems.map(it => (
          <div key={it.key} className="side-item" role="link" tabIndex={0}>
            <span className="side-icon">{it.icon}</span>
            <span className="side-text">{it.label}</span>
          </div>
        ))}
      </div>

      <hr className="divider" />

      <div className="side-section side-settings" aria-label="Settings">
        {settingsItems.map(it => (
          <div key={it.key} className="side-item" role="link" tabIndex={0}>
            <span className="side-icon">{it.icon}</span>
            <span className="side-text">{it.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <small>© 2025 YourApp</small>
      </div>
    </aside>
  );
}


