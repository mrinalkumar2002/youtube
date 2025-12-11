import React from "react";
import { useNavigate } from "react-router-dom";
import "./PagenotFound.css";

function PagenotFound() {
  const navigate = useNavigate();

  return (
    <main className="p404-root" role="main" aria-labelledby="p404-title">
      <div className="p404-card" role="dialog" aria-modal="true">
        <h1 id="p404-title">Error 404!</h1>
        <p className="p404-subtitle">Page Not Found</p>

        <button
          className="p404-btn"
          onClick={() => navigate("/")}
          aria-label="Go back to home"
        >
          Go Back Home
        </button>
      </div>
    </main>
  );
}

export default PagenotFound;

