// src/Pages/ChannelPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Channelpage.css";

export default function ChannelPage({ apiBase = "http://localhost:2000" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [videos, setVideos] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  // form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // video being edited or null
  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
    thumbnailUrl: "",
    visibility: "public",
  });

  // helper: parse response safely (avoid calling .json() on HTML)
  async function parseResponseSafely(res) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    // not JSON (likely HTML error page) — return text so we can surface it in logs/errors
    const text = await res.text();
    return { __rawText: text };
  }

  // helper: generic fetch that attaches credentials and bearer token if present,
  // and throws with helpful message (including server body text if not JSON)
  async function fetchWithAuth(url, opts = {}) {
    const token = localStorage.getItem("token");
    const headers = { ...(opts.headers || {}) };
    if (!headers["Content-Type"] && opts.body && typeof opts.body === "string") {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      credentials: "include",
      ...opts,
      headers,
    });

    const parsed = await parseResponseSafely(res);

    if (!res.ok) {
      // build a helpful message
      const serverMessage =
        parsed && typeof parsed === "object" && parsed.message
          ? parsed.message
          : parsed && parsed.__rawText
          ? parsed.__rawText.slice(0, 200) // show first 200 chars of raw HTML/text
          : `HTTP ${res.status}`;
      const err = new Error(serverMessage);
      err.status = res.status;
      err.responseBody = parsed;
      throw err;
    }

    return parsed;
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus({ loading: true, error: null });
      try {
        // fetch channel
        const cUrl = `${apiBase}/api/auth/channel/${id}`;
        const cParsed = await fetchWithAuth(cUrl, { method: "GET" });

        // if API returned raw text in parsed (non-json), throw so UI shows a helpful error
        if (cParsed && cParsed.__rawText) {
          throw new Error(`Server returned non-JSON response for channel: ${cParsed.__rawText.slice(0, 300)}`);
        }

        // expected shape: { user: {...}, isOwner: boolean } OR maybe channel directly — handle both
        const user = cParsed.user || cParsed.channel || cParsed;
        const isOwnerFlag = Boolean(cParsed.isOwner);

        if (!user || !user._id) {
          throw new Error("Channel data missing or malformed");
        }

        if (cancelled) return;
        setChannel(user);
        setIsOwner(isOwnerFlag);

        // fetch videos
        const vUrl = `${apiBase}/api/videos/channel/${id}/videos`;
        const vParsed = await fetchWithAuth(vUrl, { method: "GET" });

        if (vParsed && vParsed.__rawText) {
          throw new Error(`Server returned non-JSON response for videos: ${vParsed.__rawText.slice(0, 300)}`);
        }

        const vids = vParsed.videos || vParsed.data || [];
        if (cancelled) return;
        setVideos(Array.isArray(vids) ? vids : []);
        setStatus({ loading: false, error: null });
      } catch (err) {
        console.error("ChannelPage load error:", err);
        // show short message to user, but log full details to console (including res body)
        setStatus({ loading: false, error: err.message || "Failed to load channel" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, apiBase]);

  // open create form
  function openCreate() {
    setEditing(null);
    setForm({ title: "", description: "", url: "", thumbnailUrl: "", visibility: "public" });
    setShowForm(true);
  }

  // open edit form
  function openEdit(video) {
    setEditing(video);
    setForm({
      title: video.title || "",
      description: video.description || "",
      url: video.url || "",
      thumbnailUrl: video.thumbnailUrl || "",
      visibility: video.visibility || "public",
    });
    setShowForm(true);
  }

  // submit create or edit
  async function submitForm(e) {
    e.preventDefault();
    try {
      if (editing) {
        // update
        const res = await fetchWithAuth(`${apiBase}/api/videos/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });

        const updated = res.video || res;
        setVideos((prev) => prev.map((v) => (v._id === (updated._id || updated.id) ? updated : v)));
      } else {
        // create
        const res = await fetchWithAuth(`${apiBase}/api/videos`, {
          method: "POST",
          body: JSON.stringify(form),
        });

        const created = res.video || res;
        setVideos((prev) => [created, ...prev]);
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("Save video error:", err);
      alert(err.message || "Save failed");
    }
  }

  // delete video
  async function deleteVideo(videoId) {
    if (!window.confirm("Delete this video?")) return;
    try {
      await fetchWithAuth(`${apiBase}/api/videos/${videoId}`, {
        method: "DELETE",
      });
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("Delete video error:", err);
      alert(err.message || "Delete failed");
    }
  }

  if (status.loading) return <div className="loading-msg">Loading channel...</div>;
  if (status.error) return <div className="loading-msg">Error: {status.error}</div>;
  if (!channel) return <div className="loading-msg">No channel found</div>;

  return (
    <div className="channel-page">
      <div className="channel-container">
        <div className="channel-header">
          <img src={channel.avatarUrl || "https://i.pravatar.cc/100"} alt="avatar" className="channel-avatar" />
          <div>
            <h1 className="channel-username">{channel.username}'s Channel</h1>
            <div className="channel-subinfo">{channel.email}</div>
          </div>

          {isOwner && (
            <div style={{ marginLeft: "auto" }}>
              <button onClick={openCreate}>Create Video</button>
            </div>
          )}
        </div>

        {showForm && (
          <div className="video-form card">
            <h3>{editing ? "Edit Video" : "Create Video"}</h3>
            <form onSubmit={submitForm}>
              <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input placeholder="Thumbnail URL" value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} />
              <input required placeholder="Video URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit">{editing ? "Save" : "Create"}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="channel-videos">
          <h2>Videos</h2>
          {videos.length === 0 && <p>No videos uploaded yet.</p>}
          <div className="videos-grid">
            {videos.map((v) => (
              <div key={v._id} className="video-card">
                <img src={v.thumbnailUrl || `https://i.pravatar.cc/300?u=${v._id}`} alt={v.title} />
                <div className="video-info">
                  <h4>{v.title}</h4>
                  <p className="muted">{v.views || 0} views • {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "—"}</p>
                </div>

                {isOwner && (
                  <div className="video-actions">
                    <button onClick={() => openEdit(v)}>Edit</button>
                    <button onClick={() => deleteVideo(v._id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



