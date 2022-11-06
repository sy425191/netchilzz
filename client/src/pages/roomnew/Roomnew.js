import { useContext, useState } from "react";
import swal from "sweetalert2";
import SocketContext from "../../socketContext/SocketContext";
import { AuthContext } from "../../authContext/AuthContext";
import Swal from "sweetalert2";

const Roomnew = () => {
  const user = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [roomValue, setRoomValue] = useState("");
  const [roomPsw, setRoomPsw] = useState("");
  const [pswDisplay, setPswDisplay] = useState(false);

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
  }

  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center w-100"
        style={{ height: "90vh" }}
      >
        <div className="d-flex">
          <div
            className="mx-2 rounded text-white bg-dark d-flex justify-content-center align-items-center"
            style={{ width: "220px", height: "180px", cursor: "pointer" }}
            onClick={createPublicRoom}
          >
            <div className="d-flex flex-column align-items-center">
              <i className="fa fa-group fa-3x mb-1"></i>
              <span>Public Room</span>
            </div>
          </div>
          <div
            className="mx-2 rounded text-white bg-dark d-flex justify-content-center align-items-center"
            style={{ width: "220px", height: "180px", cursor: "pointer" }}
            onClick={createPrivateRoom}
          >
            <div className="d-flex flex-column align-items-center">
              <i className="fa fa-user-secret fa-3x mb-1"></i>
              <span>Private Room</span>
            </div>
          </div>
        </div>
        <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
          <span className="border-bottom mb-2">OR</span>
          <form className="input-group" onSubmit={handleJoin}>
            <input
              type="text"
              className="form-control"
              placeholder="Room ID"
              value={roomValue}
              onChange={(e) => setRoomValue(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={roomPsw}
              onChange={(e) => setRoomPsw(e.target.value)}
              style={{ display: pswDisplay ? "block" : "none" }}
            />
            <button className="btn btn-outline-primary">Join</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Roomnew;
