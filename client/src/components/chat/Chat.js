import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../authContext/AuthContext";
import RoomContext from "../../roomContext/roomContext";
import SocketContext from "../../socketContext/SocketContext";
import { date_to_days } from "../functions";
import "./chat.css";

const Chat = () => {
  const user = useContext(AuthContext);
  const [Chats, setChats] = useState([]);
  const [Chat, setChat] = useState("");
  const { roomState, setRoomState } = useContext(RoomContext);

  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on("message", (data) => {
      printChat({
        message: data.message,
        username: data.username,
        date: new Date(),
        pinned: false,
        admin: false,
      });
    });
  }, [socket]);

  const printChat = (msg) => {
    setChats((prev) => [...prev, msg]);
    setTimeout(() => {
      const chat_view = document.getElementById("chat-view");
      chat_view.scrollTop = chat_view.scrollHeight;
    }, 100);
  };

  const addChat = (e) => {
    e.preventDefault();
    if (Chat !== "") {
      socket.emit(
        "message",
        {
          roomId: roomState.roomId,
          message: Chat,
          username: user.user.username,
          userId: user.user._id,
        },
        (data) => {
          // console.log(data);
        }
      );
      printChat({
        message: Chat,
        username: user.user.username,
        date: new Date(),
        pinned: false,
        admin: false,
      });
      setChat("");
    }
  };
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div
        className="flex flex-col gap-y-2 px-1 py-2 overflow-auto"
        id="chat-view"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        {Chats.map((chat) => {
          return (
            <div
              className={
                chat.username === user.user.username
                  ? "flex flex-row w-full justify-between rounded bg-cyan-500/20"
                  : "flex flex-row w-full justify-between rounded bg-slate-500/20"
              }
            >
              <div className="flex flex-col p-1">
                <div className="w-full flex justify-start items-center gap-x-3">
                  <div
                    className={
                      chat.admin === true ? "text-rose-800" : "text-cyan-800"
                    }
                  >
                    <span className="font-[monospace] underline">
                      @{chat.username}
                    </span>
                  </div>
                  <div className="text-xs">{date_to_days(chat.date)}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm">{chat.message}</div>
                </div>
              </div>

              <span
                className="btn-tr p-2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              >
                <i className="fa fa-ellipsis-v"></i>
              </span>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#">
                  Report
                </a>
                <a className="dropdown-item" href="#">
                  Block
                </a>
              </div>
            </div>
          );
        })}
      </div>
      <form className="flex flex-row" onSubmit={addChat}>
        <div className="w-full flex justify-between h-10">
          <input
            type="text"
            className="flex-1 px-1 border-t-2"
            placeholder="Type something..."
            value={Chat}
            onChange={(e) => setChat(e.target.value)}
          />
          <div className="w-10 h-full bg-cyan-500 flex justify-center items-center rounded-r text-white">
            <button className="" type="button" id="button-addon2">
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Chat;
