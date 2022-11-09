const { default: mongoose } = require("mongoose");
const roomModel = require("../models/Room");
const mediaModel = require("../models/Media");
const https = require("https");

const Room = (io, socket) => {
  socket.on("createRoom", async (res, cb) => {
    // create a new Room and save it to the database
    const newroom = new roomModel({
      name: res.data.name,
      admin: res.data.userId,
      key: generateRandomKey(),
      userArray: [{ userId: res.data.userId, username: res.data.username }],
      bannedUsers: [],
      isPrivate: res.data.isPrivate,
    });
    newroom.save().then(async (room) => {
      await socket.join(room._id.toString());
      await socket.join(room.admin.toString());
      cb({
        room: {
          name: room.name,
          roomId: room._id,
          key: room.key,
        },
        message: "Room created successfully",
      });
    });
  });

  // Add user to room
  socket.on("addToRoom", async (res, cb) => {
    const roomId = res.roomId;
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      cb({
        error: "Room does not exist",
      });
      return;
    }
    const room = await roomModel.findById(res.roomId);
    if (room) {
      // if banned
      if (room.bannedUsers.find((user) => user.userId === res.userId)) {
        cb({
          error: "You are banned from this room",
        });
        return;
      }
      if (room.isPrivate === true) {
        if (room.key === res.password) {
          await socket.join(res.roomId.toString());
          await socket.join(res.userId.toString());
          //   add user to room
          if (!room.userArray.find((user) => user.userId === res.userId)) {
            roomModel.findOneAndUpdate(
              { _id: res.roomId },
              {
                $push: {
                  userArray: { userId: res.userId, username: res.username },
                },
              },
              { new: true },
              (err, doc) => {
                if (err) {
                  console.log("Something wrong when updating data!");
                }
              }
            );
          }
          cb({
            room: {
              name: room.name,
              isPrivate: room.isPrivate,
              roomId: room._id,
            },
            message: "Joined room successfully",
          });
        } else {
          cb({
            error: "Wrong password",
          });
        }
      } else {
        roomModel.findOneAndUpdate(
          { _id: res.roomId },
          {
            $push: {
              userArray: { userId: res.userId, username: res.username },
            },
          },
          { new: true },
          (err, doc) => {
            if (err) {
              console.log("Something wrong when updating data!");
            }
          }
        );
        cb({
          room: {
            name: room.name,
            isPrivate: room.isPrivate,
            roomId: room._id,
          },
          message: "Joined room successfully",
        });
      }
    } else {
      cb({
        error: "Room does not exist",
      });
    }
  });

  // join to room
  socket.on("joinRoom", async (res, cb) => {
    const roomId = res.roomId;
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      cb({
        error: "Room does not exist",
      });
      return;
    }
    const room = await roomModel.findById(res.roomId);
    if (room) {
      // if banned
      if (room.bannedUsers.find((user) => user.userId === res.userId)) {
        cb({
          error: "You are banned from this room",
        });
        return;
      } else if (room.userArray.find((user) => user.userId === res.userId)) {
        await socket.join(res.roomId);
        await socket.join(res.userId);
        cb({
          room: {
            name: room.name,
            isHost: room.admin === res.userId,
            roomId: room._id,
          },
          message: "Joined room successfully",
        });
      } else {
        cb({
          error: "You are not in this room",
        });
      }
    } else {
      cb({
        error: "Room does not exist",
      });
    }
  });

  // search Room
  socket.on("searchRoom", async (res, cb) => {
    const roomId = res.roomId;
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      cb({
        room: null,
        error: "Room not found",
      });
      return;
    }
    const room = await roomModel.findById(res.roomId);
    if (room) {
      cb({
        room: {
          isPrivate: room.isPrivate,
        },
        message: "Room found",
      });
    } else {
      cb({
        room: null,
        message: "Room not found",
      });
    }
  });

  socket.on("PlayInRoom", async (res, cb) => {
    const roomId = res.roomId;
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      cb({
        error: "Room does not exist",
      });
      return;
    }
    const room = await roomModel.findById(res.roomId);
    if (room) {
      // if admin
      if (room.admin === res.userId) {
        const mediaId = res.mediaId;
        if (!mongoose.Types.ObjectId.isValid(mediaId)) {
          cb({
            error: "Media does not exist",
          });
          return;
        }
        const media = await mediaModel.findById(res.mediaId);
        // set media to room
        roomModel.findOneAndUpdate(
          { _id: res.roomId },
          {
            $set: {
              media: media.mediaUrl,
            },
          },
          { new: true },
          (err, doc) => {
            if (err) {
              console.log("Something wrong when updating data!");
            }
          }
        );
      } else {
        cb({
          error: "You are not admin",
        });
      }
    } else {
      cb({
        error: "Room does not exist",
      });
    }
  });
};

const generateRandomKey = () => {
  const key =
    Math.random().toString(36).substring(2, 6) +
    Math.random().toString(36).substring(2, 7);
  return key;
};

module.exports = Room;
