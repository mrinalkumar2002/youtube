// src/Pages/Home.jsx
import React from "react";
import Sidebar from "../Navbar/Sidebar";
import HomePage from "../Components/HomePage";
import "./Home.css";

export default function Home({ collapsed }) {
  return (
    <>
      <Sidebar collapsed={collapsed} /> {/* control side bar scroll*/}

      <main className={`content ${collapsed ? "sidebar-collapsed" : ""}`}>
        <HomePage />   {/*render homepage*/}
      </main>
    </>
  );
}








