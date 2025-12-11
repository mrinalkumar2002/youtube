

// src/Pages/VideoPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../Components/CommentSection";
import "./VideoPage.css";

export default function VideoPage() {
  const params = useParams();
  const param = params.videoId ?? params.id;
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [descOpen, setDescOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadVideo() {
      if (!param) {
        setError("No video id in URL (use /video/:videoId)");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const url = `http://localhost:2000/api/data/video/${encodeURIComponent(param)}`;
        const res = await fetch(url);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`);
        }
        const data = await res.json();
        if (mounted) setVideo(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load video");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadVideo();

    return () => (mounted = false);
  }, [param]);

  if (loading) return <div className="vp-root"><div className="vp-loading">Loading...</div></div>;
  if (error) return <div className="vp-root"><div className="vp-error">Error: {error}</div></div>;
  if (!video) return <div className="vp-root"><div className="vp-empty">No video found.</div></div>;

  return (
    <div className="vp-root">
      <div className="vp-main">
        <div className="vp-player-area">
          <div className="vp-player-wrapper">
            <video
              className="vp-video"
              controls
              poster={video.thumbnailUrl || video.photo}
              src={video.videoUrl}
            />
          </div>

          <h1 className="vp-title">{video.title}</h1>

          <div className="vp-stats-actions">
            <div className="vp-stats">
              <span>{video.views ?? 0} views</span>
              <span className="vp-dot">•</span>
              <span>{video.duration ?? ""}</span>
            </div>

            <div className="vp-actions">
              <button className="vp-action">👍 {video.likes ?? 0}</button>
              <button className="vp-action">👎</button>
              <button className="vp-action">Share</button>
              <button className="vp-action">Save</button>
            </div>
          </div>

          <div className="vp-channel-row">
            <img className="vp-avatar" src={video.channelAvatar || video.authorAvatar || video.photo} alt="channel avatar" />

            <div className="vp-channel-info">
              <div className="vp-channel-name">{video.author}</div>
              <div className="vp-channel-subs">{video.subscribers ? `${video.subscribers} subscribers` : ""}</div>
            </div>

            <button className="vp-subscribe">Subscribe</button>
          </div>

          <div className={`vp-description ${descOpen ? "open" : ""}`}>
            <div className="vp-desc-text">{video.description}</div>
            {video.description && video.description.length > 200 && (
              <button className="vp-desc-toggle" onClick={() => setDescOpen((s) => !s)}>
                {descOpen ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          {/* Comments mounted at the bottom of the player area */}
          <CommentSection videoId={param} />
        </div>

        <aside className="vp-side">
          <h3 className="vp-side-title">Up next</h3>
          {video.related && video.related.length ? (
            video.related.map((r, i) => (
              <a className="vp-side-item" key={i} href={`/video/${r.videoId || r.id}`}>
                <img className="vp-side-thumb" src={r.thumbnailUrl || r.photo} alt={r.title} />
                <div className="vp-side-meta">
                  <div className="vp-side-title-text">{r.title}</div>
                  <div className="vp-side-views">{r.views ?? 0} views</div>
                </div>
              </a>
            ))
          ) : (
            <div className="vp-side-empty">No suggestions</div>
          )}
        </aside>
      </div>
    </div>
  );
}
