import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    thumbnailUrl: {
      type: String,
      required: true,
      trim: true,
    },

    photo: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
    },

    // Stored as STRING ("24,969,123"), so string type is correct
    views: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // Stored as STRING ("25,254,545 Subscribers")
    subscriber: {
      type: String,
      required: true,
    },

    channelId: {
      type: String,
      required: true,
    },

    uploader: {
      type: String,
      required: true,
    },

    likes: {
      type: Number,
      required: true,
    },

    dislikes: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Data = mongoose.model("Data", dataSchema);
export default Data;

