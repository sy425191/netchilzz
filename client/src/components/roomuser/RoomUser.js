import { useState, useContext, useEffect, useRef } from "react";
import { chatContext } from "../../chatContext/ChatContext";
import RoomContext from "../../roomContext/roomContext";
import SocketContext from "../../socketContext/SocketContext";
import Chat from "../chat/Chat";

export const RoomUser = ({ roomId }) => {
  const { roomState, setRoomState } = useContext(RoomContext);
  const socket = useContext(SocketContext);
  const { chatopen, setChatOpen, chatToggle } = useContext(chatContext);
  const VideoRef = useRef();

  useEffect(() => {
    socket.on("sync", (data) => {
      // console.log(data);
      if (data.isPlaying === true) {
        VideoRef.current.muted = true;
        VideoRef.current.play();
      } else {
        VideoRef.current.pause();
      }
      VideoRef.current.currentTime = data.currentTimeinSec;
      VideoRef.current.playbackRate = data.playbackRate;
      // Remove the event listener
      socket.off("sync");
    });
  }, []);

  useEffect(() => {
    const videoelem = document.getElementById("video");
    socket.on("playMedia", (data) => {
      videoelem.muted = true;
      videoelem.play();
    });
    socket.on("pauseMedia", (data) => {
      videoelem.pause();
    });
    socket.on("timeStamp", (data) => {
      const { currentTime } = data;
      const isplaying = videoelem.paused;
      videoelem.currentTime = currentTime;
      if (isplaying) {
        videoelem.pause();
      } else {
        videoelem.play();
      }
    });
    socket.on("playBackRate", (data) => {
      const { playbackRate } = data;
      videoelem.playbackRate = playbackRate;
    });

    socket.on("changeVideo", (data) => {
      // reload the page [temporary solution]
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
  }, []);

  return (
    <div className="room_host">
      <div className="room_host__container">
        <span> {roomState.roomName}</span>
        <span className="room_host__container__host">
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
        <div className="content-player">
          <video
            controls={false}
            className=""
            autoPlay
            width={"100%"}
            height={"90%"}
            id="video"
            ref={VideoRef}
          >
            <source
              src={"http://127.0.0.1:8800/api/media/roomplaying/" + roomId}
              type="video/mp4"
              id="source"
            />
          </video>
        </div>
        <div
          className="room-chat"
          style={{ display: chatopen ? "block" : "none" }}
        >
          <Chat />
        </div>
      </div>
    </div>
  );
};
