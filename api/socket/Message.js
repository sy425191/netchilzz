const roomModel = require("../models/Room");
const { default: mongoose } = require("mongoose");
const Message = (io, socket) => {
  // send message to room
  socket.on("message", async (res, cb) => {
    console.log("Message from " + socket.id + " to " + res.roomId);
    const roomId = res.roomId;
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.log("Invalid room id");
      return;
    }
    const message = {
      userId: res.userId,
      username: res.username,
      message: res.message,
    };
    const Room = await roomModel.findById(roomId);
    if (Room) {
        roomModel.findOneAndUpdate(
        { _id: roomId },
        {
          $push: {
            messages: message,
          },
        },
        { new: true },
        (err, doc) => {
        }
      );
      socket.to(roomId).emit("message", message);
    }
  });
};

module.exports = { Message };
