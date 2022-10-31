const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    user : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: { type: String, required: true },
    description: { type: String },
    imgUrl: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    genre: { type: String },
    tags: { type: Array },
    streams: { type: Number, default: 0 },
    upvotes: { type: Array, default: [] },
    downvotes: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    type: { type: String, required: true },
    private: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);