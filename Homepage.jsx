import "./HomePage.css";
import Filterbar from "./Filterbar"; // keep the same filename you have in project
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function HomePage() {
  const [data, setData] = useState([]); // video array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // navigate to the video page for a specific videoId (not the literal ':videoId')
  function handleVideo(videoId) {
    if (!videoId) return;
    navigate(`/video/${videoId}`);
  }

  // fetch the initial "all videos" list
  const getData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:2000/api/data/getdata");
      const result = await response.json();

      // support multiple backend shapes: { data: [...] } or [...] directly
      if (Array.isArray(result.data)) {
        setData(result.data);
      } else if (Array.isArray(result)) {
        setData(result);
      } else if (Array.isArray(result.videos)) {
        setData(result.videos);
      } else {
        // fallback: try to find any array inside the response
        const arr = Object.values(result).find((v) => Array.isArray(v));
        setData(Array.isArray(arr) ? arr : []);
        console.warn("Unexpected getData response shape:", result);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch videos");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for search results coming from Navbar
  const handleSearchResults = (arr) => {
    setData(Array.isArray(arr) ? arr : []);
    setLoading(false);
    setError(null);
  };

  return (
    <div className="homepage-root">
      {/* Navbar stays part of page (you might already render Navbar at App level; keep if needed) */}
      <Navbar
        onSearchResults={(arr) => {
          handleSearchResults(arr);
        }}
      />

      {/* Filterbar sits under navbar and above grid */}
      <div className="homepage-top">
        <Filterbar
          method="GET"
          apiBase="http://localhost:2000"
          onResults={(arr) => {
            setData(Array.isArray(arr) ? arr : []);
            setLoading(false);
            setError(null);
          }}
        />
      </div>

      {/* content area (pushes to the right to respect sidebar using CSS variables) */}
      <main className="homepage-content">
        <div className="video-grid">
          {loading ? (
            <p className="status-text">Loading videos...</p>
          ) : error ? (
            <p className="status-text error">Error: {error}</p>
          ) : data.length === 0 ? (
            <p className="status-text">No videos found.</p>
          ) : (
            data.map((item) => {
              const id = item.videoId || item._id || item.id;
              const thumb = item.thumbnailUrl || item.photo || "";
              const title = item.title || "Untitled";
              const author = item.author || item.uploader || item.channel || "Unknown";
              const views = item.views ?? item.viewCount ?? "0";

              return (
                <article
                  className="video-card"
                  key={id || title}
                  onClick={() => handleVideo(id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleVideo(id);
                  }}
                >
                  <div className="thumb-wrap">
                    <img
                      className="thumb"
                      src={thumb || "https://via.placeholder.com/480x270?text=No+Thumb"}
                      alt={title}
                      loading="lazy"
                    />
                    <span className="duration">12:34</span>
                  </div>

                  <div className="video-meta">
                    <h3 className="video-title" title={title}>
                      {title}
                    </h3>
                    <div className="video-sub"> {author} </div>
                    <div className="video-views">{views} views</div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}





