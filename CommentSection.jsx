import React, { useEffect, useState } from "react";
import "./CommentSection.css"

// CommentSection-frontend-only.jsx (NO INTERNAL STYLING)
// Pure logic-only component — style with your own external CSS.

export default function CommentSectionLocal({ videoId = "global", autoUsername = "" }) {
  const STORAGE_KEY = `comments:${videoId}`;
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState(autoUsername);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const MAX_CHARS = 500;

  // Load comments from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setComments(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to read comments", e);
    }
  }, [STORAGE_KEY]);

  // Save comments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch (e) {
      console.error("Failed to save comments", e);
    }
  }, [comments, STORAGE_KEY]);

  function timeAgo(iso) {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  function avatarLetters(name) {
    if (!name) return "A";
    const parts = name.trim().split(/\s+/);
    return parts.length === 1 ? parts[0][0].toUpperCase() : (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const txt = text.trim();
    if (!txt) return setError("Please write a comment before posting.");
    if (txt.length > MAX_CHARS) return setError(`Comment is too long (max ${MAX_CHARS} characters).`);

    const comment = {
      id: `c_${Date.now()}`,
      videoId,
      username: username.trim() || "Anonymous",
      text: txt,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [comment, ...prev]);
    setText("");
  }

  function handleDelete(id) {
    if (!confirm("Delete this comment?")) return;
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <section className="cs-root">
      <h2>Comments</h2>

      <form className="cs-form" onSubmit={handleSubmit}>
        <div className="cs-avatar">{avatarLetters(username || "A")}</div>

        <div className="cs-body">
          <input
            className="cs-username"
            placeholder="Name (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={50}
          />

          <textarea
            className="cs-textarea"
            placeholder="Add a public comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={MAX_CHARS}
          />

          <div className="cs-controls">
            <span>{text.length}/{MAX_CHARS}</span>
            <div>
              <button type="button" onClick={() => setText("")}>Cancel</button>
              <button type="submit">Comment</button>
            </div>
          </div>

          {error && <div className="cs-error">{error}</div>}
        </div>
      </form>

      <div className="cs-list-wrap">
        <div>{comments.length} comment{comments.length !== 1 ? "s" : ""}</div>

        <ul className="cs-list">
          {comments.length === 0 ? (
            <div>No comments yet — be the first!</div>
          ) : (
            comments.map((c) => (
              <li className="cs-item" key={c.id}>
                <div className="cs-avatar">{avatarLetters(c.username)}</div>
                <div className="cs-item-right">
                  <div className="cs-item-top">
                    <span className="cs-item-name">{c.username}</span>
                    <span className="cs-item-time">· {timeAgo(c.createdAt)}</span>
                    <button className="cs-delete" onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                  <div className="cs-item-text">{c.text}</div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

