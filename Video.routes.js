// routes/videos.js
import express from "express";
import { Auth } from "../Middlewares/auth.middleware.js";
import {
  createVideo,
  getChannelVideos,
  getVideo,
  updateVideo,
  deleteVideo
} from "../Controller/Video.Controller.js";

const router = express.Router();

// IMPORTANT: put specific static routes BEFORE dynamic ones
// GET channel videos (public for now — remove `Auth` if you want public access)
router.get("/channel/:id/videos", /*Auth,*/ getChannelVideos);

// CRUD
router.post("/", Auth, createVideo);
router.get("/:id", getVideo);
router.put("/:id", Auth, updateVideo);
router.delete("/:id", Auth, deleteVideo);

export default router;


