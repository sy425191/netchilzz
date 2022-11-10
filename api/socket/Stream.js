const roomModel = require("../models/Room");
const Stream = (io, socket) => {

    // get data from host and send to client
    socket.on("stream", async (stream, data) => {
        console.log("streaming from " + socket.id + " to " + data.roomId);
        const roomId = data.roomId;
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            console.log("Invalid room id");
            return;
        }
        const Room = await roomModel.findById(roomId);
        if (Room) {
            socket.to(roomId).emit("stream", stream);
        }
    });

    socket.on('playMedia', async (data) => {
        const roomId = data.roomId;
        socket.to(roomId).emit('playMedia', data);
    });
    socket.on('pauseMedia', async (data) => {
        const roomId = data.roomId;
        socket.to(roomId).emit('pauseMedia', data);
    });
    
    socket.on('changeVideo', async (data) => {
        const roomId = data.roomId;
        socket.to(roomId).emit('changeVideo', data);
    });

    socket.on('timeStamp', async (data) => {
        const roomId = data.roomId;
        socket.to(roomId).emit('timeStamp', data);
    });

    socket.on('playBackRate', async (data) => {
        const roomId = data.roomId;
        socket.to(roomId).emit('playBackRate', data);
    });
    
    socket.on('endRoom', async (data) => {
        const roomId = data.roomId;
        socket.to(roomId).emit('endRoom', data);
    });

    socket.on('sync', async (data) => {
        const roomId = data.roomId;
        socket.to(roomId).emit('sync', data);
    });
    
};

module.exports = Stream;