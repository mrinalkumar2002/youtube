import express from "express";
import { Register, Login } from "../Controller/User.controller.js";
import { Auth } from "../Middlewares/auth.middleware.js";   // <-- add this
import User from "../Model/user.model.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.post("/register", Register);
router.post("/login", Login);


// --- PROTECTED ROUTES ---

// 1️⃣ Get Logged-in user (used for frontend protection)
router.get("/me", Auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/channel/:id  — allow any authenticated user to view a channel
router.get("/channel/:id", Auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isOwner = req.user && (String(req.user.id) === String(req.params.id));

    return res.json({ user, isOwner });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


export default router;



