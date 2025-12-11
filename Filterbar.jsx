// FilterBar.jsx
import React, { useState } from "react";
import "./FilterBar.css";

/**
 * Props:
 * - method: "GET" | "POST"  (default "GET")  // choose depending on your backend
 * - onResults: function(array)               // optional callback to receive results
 * - apiBase: string                          // optional base, default http://localhost:2000
 */
export default function FilterBar({ method = "GET", onResults, apiBase = "http://localhost:2000" }) {
  const categories = [
    "All",
     "Music",
    "Gaming",
    "Basketball",
    "News",
    "Movies",
    "Comedy",
    "Fitness",
    "Coding",
    "Watched",
    "Technology",
    "Science",
    "Education",
  ];

  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelect = (cat) => {
    setSelected(cat);
    fetchFiltered(cat);
  };

  const normalizeArray = (result) => {
    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (result.data && Array.isArray(result.data)) return result.data;
    if (result.videos && Array.isArray(result.videos)) return result.videos;
    // try to detect nested arrays anywhere (last resort)
    const arr = Object.values(result).find((v) => Array.isArray(v));
    return Array.isArray(arr) ? arr : [];
  };

  const fetchFiltered = async (category) => {
    setLoading(true);
    setError(null);

    try {
      let resultJson;
      if (method === "GET") {
        // if category === "All" we'll call a get-all endpoint
        const url =
          category && category !== "All"
            ? `${apiBase}/api/data/filter?category=${encodeURIComponent(category)}`
            : `${apiBase}/api/data/getdata`;
        const res = await fetch(url);
        resultJson = await res.json();
      } else {
        // POST option: send category in body
        const url = `${apiBase}/api/data/filter`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: category === "All" ? "" : category }),
        });
        resultJson = await res.json();
      }

      const arr = normalizeArray(resultJson);
      if (onResults) onResults(arr);
      setLoading(false);
    } catch (err) {
      console.error("Filter fetch error:", err);
      setError(err.message || "Failed to fetch");
      if (onResults) onResults([]);
      setLoading(false);
    }
  };

 
  React.useEffect(() => {
    // load initial "All" list
    fetchFiltered("All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="filter-bar">
      <div className="filter-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${selected === cat ? "active" : ""}`}
            onClick={() => handleSelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="filter-meta">
        {loading && <span className="meta loading">Loading...</span>}
        {error && <span className="meta error">Error: {error}</span>}
        {!loading && !error && <span className="meta">{selected} results</span>}
      </div>
    </div>
  );
}

