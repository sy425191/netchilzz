const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    user : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    title: { type: String, required: true },
    description: { type: String },
    imgUrl: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    genre: { type: String },
    tags: { type: Array, default: [] },
    streams: { type: Number, default: 0 },
    upvotes: { type: Array, default: [] },
    downvotes: { type: Array, default: [] },
    type: { type: String, required: true },
    private: { type: Boolean, default: false },
    favorites: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);