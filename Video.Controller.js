import Video from "../Model/Video.model.js";


// Create a new video (owner must be authenticated)
export const createVideo = async (req, res) => {
  try {
    const { title, description, url, thumbnailUrl, visibility, tags } = req.body;
    if (!title || !url) return res.status(400).json({ message: "Title and url required" });

    const video = new Video({
      title,
      description,
      url,
      thumbnailUrl,
      visibility: visibility || "public",
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t=>t.trim()) : []),
      owner: req.user.id,
    });

    await video.save();
    return res.status(201).json({ video });
  } catch (err) {
    console.error("createVideo error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get videos for a channel (public + own private)
export const getChannelVideos = async (req, res) => {
  try {
    const channelId = req.params.id;
    const requesterId = req.user?.id; // may be undefined if route is public
    // show public videos AND private videos if owner
    const query = {
      owner: channelId,
      $or: [
        { visibility: "public" },
        ...(String(channelId) === String(requesterId) ? [{ visibility: { $in: ["private","unlisted","public"] } }] : []),
      ],
    };

    // if not owner, the query becomes owner + visibility public
    if (String(channelId) !== String(requesterId)) {
      query.visibility = "public";
      delete query.$or;
    }

    const videos = await Video.find({ owner: channelId, ...(String(channelId) !== String(requesterId) ? { visibility: "public" } : {}) })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ videos });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get single video
export const getVideo = async (req, res) => {
  try {
    const v = await Video.findById(req.params.id).populate("owner", "-password").lean();
    if (!v) return res.status(404).json({ message: "Video not found" });
    // If private and requester not owner -> 403
    if (v.visibility === "private" && String(v.owner._id) !== String(req.user?.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    return res.json({ video: v });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update video - only owner
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Not found" });
    if (String(video.owner) !== String(req.user.id)) return res.status(403).json({ message: "Not allowed" });

    const updates = ["title","description","thumbnailUrl","visibility","tags","url"];
    updates.forEach(f => {
      if (f in req.body) video[f] = req.body[f];
    });

    await video.save();
    return res.json({ video });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete video - only owner
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Not found" });
    if (String(video.owner) !== String(req.user.id)) return res.status(403).json({ message: "Not allowed" });

    await Video.deleteOne({ _id: id });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
