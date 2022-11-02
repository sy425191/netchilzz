const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const mediaRoute = require("./routes/media");
const playlistRoute = require("./routes/playlist");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/media", mediaRoute)
app.use("/api/playlists", playlistRoute);
app.listen(8800, () => {
  console.log("Backend server is running!");
});