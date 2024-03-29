const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema( // Schema is a constructor inside mongoose class
// and we pass an jS object as parameter
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, defaut: "" },
    status: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    favorites: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema); 