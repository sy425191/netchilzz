const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: {
    type: String,
    required: true,
  },
  key: { type: String, required: true },
  media: { type: String, default: "" },
  userArray: [
    {
      userId: { type: String, required: true },
      username: { type: String, required: true },
    },
  ],
  bannedUsers: [
    {
      userId: { type: String, required: true },
      username: { type: String, required: true },
    },
  ],
  messages: [
    {
      userId: { type: String, required: true },
      username: { type: String, required: true },
      message: { type: String, required: true },
    },
  ],
  isPrivate: { type: Boolean, default: false },
})
module.exports = mongoose.model("Room", RoomSchema);