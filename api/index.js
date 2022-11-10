const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const mediaRoute = require("./routes/media");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const playlistRoute = require("./routes/playlist");
const {sendMessage, Message} = require("./socket/Message");
const RoomSocket = require("./socket/Room");
const Stream = require("./socket/Stream");
const { ApiError } = require("@google-cloud/storage/build/src/nodejs-common");
const io = require("socket.io")(8000,{
  cors :{
      origin: ["http://localhost:3000", "https://admin.socket.io", "*"],
      methods: ['GET', 'POST'],
  }
})

io.on("connection", (socket) => {
  RoomSocket(io, socket);
  Message(io, socket);
  Stream(io, socket);
})

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
app.use("/api/user", userRoute);
app.use('/api/admin', adminRoute);
app.listen(process.env.PORT, () => {
  console.log("Backend server is running!");
});