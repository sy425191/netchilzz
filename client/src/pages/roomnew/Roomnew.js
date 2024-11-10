import { useContext, useState } from "react";
import swal from "sweetalert2";
import SocketContext from "../../socketContext/SocketContext";
import { AuthContext } from "../../authContext/AuthContext";
import Swal from "sweetalert2";
import RoomContext from "../../roomContext/roomContext";
import Layout from "../../components/layout/Layout";

const Roomnew = () => {
  const user = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [roomValue, setRoomValue] = useState("");
  const [roomPsw, setRoomPsw] = useState("");
  const [pswDisplay, setPswDisplay] = useState(false);
  const { setStreamMedia } = useContext(RoomContext);

  const CreateRoom = async (type) => {
    const data = {
      name: user.user.username + "'s Room",
      userId: user.user._id,
      username: user.user.username,
      isPrivate: type === "private" ? true : false,
    };
    socket.emit("createRoom", { data }, (res) => {
      callback(res);
    });
  };

  const createPublicRoom = async () => {
    swal.fire({
      title: "Creating Room...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading();
      },
    });

    await CreateRoom("public");
  };

  const createPrivateRoom = async () => {
    swal.fire({
      title: "Creating Room...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading();
      },
    });
    await CreateRoom("private");
  };

  const callback = (value) => {
    swal.close();
    if (value) {
      setStreamMedia({
        url: null,
        id: null,
      });
      window.location.href = `/room/${value.room.roomId}`;
    }
  };

  const handleJoin = async (e) => {
    Swal.showLoading();
    e.preventDefault();
    setRoomValue(roomValue.trim());
    setRoomPsw(roomPsw.trim());

    if (pswDisplay === false) {
      socket.emit("searchRoom", { roomId: roomValue }, (data) => {
        console.log(data);
        swal.close();
        if (data.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.error,
          });
        } else if (data.room.isPrivate === true) {
          setPswDisplay(true);
        } else {
          joinnow();
        }
      });
    } else {
      joinnow();
    }
  };

  const joinnow = () => {
    socket.emit(
      "addToRoom",
      {
        roomId: roomValue,
        password: roomPsw,
        userId: user.user._id,
        username: user.user.username,
      },
      (data) => {
        Swal.close();
        console.log(data);
        if (data.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.error,
          });
        } else {
          window.location.href = `/room/${roomValue}`;
        }
      }
    );
  };

  return (
    <Layout>
      <div className="w-full h-full flex justify-center mt-24">
        <div className="flex flex-col items-center rounded px-6 py-8 border-2 border-black/70 ">
          <span className="text-md font-bold text-center mb-4">
            Create or Join a Room
          </span>
          <div className="flex flex-row justify-center items-center gap-x-4">
            <div className="flex flex-col w-60 gap-y-2">
              <div
                className="w-full rounded bg-slate-950/80 text-white flex justify-between items-center gap-x-3 py-2 px-2 cursor-pointer"
                onClick={createPublicRoom}
              >
                <i className="fa fa-group"></i>
                <span className="w-full font-[monospace]">
                  /create
                  <span className="text-sky-500">Public</span>
                  room
                </span>
              </div>
              <div
                className="w-full rounded bg-slate-950/80 text-white flex justify-between items-center gap-x-3 py-2 px-2 cursor-pointer"
                onClick={createPrivateRoom}
              >
                <i className="fa fa-group"></i>
                <span className="w-full font-[monospace]">
                  /create
                  <span className="text-rose-500">Private</span>
                  room
                </span>
              </div>
            </div>
            <form
              className="flex flex-col justify-center items-center gap-y-3"
              onSubmit={handleJoin}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Room ID"
                name="roomID"
                value={roomValue}
                onChange={(e) => setRoomValue(e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                placeholder="key"
                value={roomPsw}
                onChange={(e) => setRoomPsw(e.target.value)}
                style={{ display: pswDisplay ? "block" : "none" }}
              />
              <button
                type="submit"
                className="px-4 rounded bg-cyan-600 text-white flex justify-center items-center gap-x-3 py-1 cursor-pointer font-[monospace]"
              >
                /joinRoom
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Roomnew;
