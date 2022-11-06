import "./RoomHost.css";
import { useState } from "react";
import Chat from "../chat/Chat";
export const RoomHost = ({roomId}) => {

  const [chatopen, setChatOpen] = useState(true);

  const chatToggle = () => {
    setChatOpen(!chatopen);
  };

  return (
    <div className="room_host">
      <div className="room_host__container">
        <span>Hosted by You</span>
        <span className="room_host__container__host">
          <a className="btn btn-outline-primary mx-2">Stream Content</a>
          <a className="btn btn-outline-danger mx-2">
            Settings <i className="fa fa-cog"></i>
          </a>
          <a
            className={
              "btn mx-2 " +
              (chatopen === true ? "btn-success" : "btn-outline-success")
            }
            onClick={chatToggle}
          >
            Chat <i className="fa fa-comment"></i>
          </a>
        </span>
      </div>
      <div className="room_host__body">
        <div className="content-player">e</div>
        <div className="room-chat" style={{display:(chatopen?"block":"none")}}>
          <Chat />
        </div>
      </div>
    </div>
  );
};
