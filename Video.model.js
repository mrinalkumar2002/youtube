import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },         // storage URL or stream URL
  thumbnailUrl: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  visibility: { type: String, enum: ["public","private","unlisted"], default: "public" },
  views: { type: Number, default: 0 },
  tags: [String],
}, { timestamps: true });

export default mongoose.model("Video", VideoSchema);
