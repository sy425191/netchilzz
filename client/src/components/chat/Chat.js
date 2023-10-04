import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../authContext/AuthContext";
import RoomContext from "../../roomContext/roomContext";
import SocketContext from "../../socketContext/SocketContext";
import { date_to_days } from "../functions";
import "./chat.css";
const Chat = () => {
  /* add thia class "chat-pinned" in chat item to stick the pinned message   
     Add this class "admin-tag" in sender name to highlight the admin message  */
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
    <div className="cgl-live-chat">
      <div className="chat-wrapper">
        <div className="chat-title">Live Chat</div>
        <div className="chat-view p-1" id="chat-view">
          {Chats.map((chat) => {
            return (
              <div
                className={chat.username === user.user.username ? "chat-item chat-pinned" : "chat-item"}
              >
                <div className="d-flex">
                  <img
                    src={"https://ui-avatars.com/api/?name=" + chat.username}
                    alt={chat.username}
                  />
                  <div className="p-1 w-100">
                    <div className="d-flex align-items-end justify-content-between">
                      <div>
                        <div
                          className={
                            "sender-name d-block" + chat.admin === true
                              ? "admin-tag"
                              : ""
                          }
                        >
                          <a>@{chat.username}</a>
                        </div>
                        <div className="chat-time d-block">
                          {date_to_days(chat.date)}
                        </div>
                      </div>
                      <div className="float-right">
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
                    </div>
                    <div className="chat-text">{chat.message}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="chat-message">
          <form onSubmit={addChat}>
            <div className="input-group align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="Type something..."
                value={Chat}
                onChange={(e) => setChat(e.target.value)}
              />
              <div className="input-group-append">
                <button className="" type="button" id="button-addon2">
                  <img
                    src="https://github.com/suryavmds/Live-chat-HTML-design--like-YT-chat-/blob/master/assets/img/send-btn.svg?raw=true"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
