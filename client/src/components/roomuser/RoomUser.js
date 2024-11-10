import { useState, useContext, useEffect, useRef } from "react";
import { chatContext } from "../../chatContext/ChatContext";
import RoomContext from "../../roomContext/roomContext";
import SocketContext from "../../socketContext/SocketContext";
import Chat from "../chat/Chat";
import API_ENDPOINT from "../../apiContext/apiEndpoint";

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
    <div className="w-full h-screen max-h-screen">
      <div className="w-full flex justify-between items-center h-[50px]">
        <a
          href="/"
          className="px-3 text-xl text-slate-950 rounded flex items-center gap-x-2 justify-center font-semibold"
        >
          <i className="fa fa-bars"></i>
          <span>Netchillz</span>
        </a>
        <span className="pl-24">
          <i className="fa fa-circle text-red-500 fa-fade"></i>
          <span className="text-red-500"> {roomState.roomName} </span>
        </span>
        <div className="flex flex-row gap-x-3">
          <div
            className="w-full border-2 py-1 border-cyan-600 text-cyan-600 flex justify-between items-center gap-x-3 px-3 cursor-pointer font-[monospace] rounded hover:bg-cyan-600 hover:text-white duration-500"
            data-bs-toggle="modal"
            data-bs-target="#settingModal"
          >
            /info
          </div>
          <div
            className={
              chatopen === true
                ? "w-full border-2 py-1 border-cyan-600 text-cyan-600 flex justify-between items-center gap-x-3 px-3 cursor-pointer font-[monospace] rounded bg-cyan-600 text-white duration-500"
                : "w-full border-2 py-1 border-cyan-600 text-cyan-600 flex justify-between items-center gap-x-3 px-3 cursor-pointer font-[monospace] rounded hover:bg-cyan-600 hover:text-white duration-500"
            }
            onClick={chatToggle}
          >
            /yap
          </div>
        </div>
      </div>
      <div className="flex-1 flex">
        <video
          className="w-full h-full bg-black"
          style={{
            height: "calc(100vh - 50px)",
            width: chatopen === true ? "calc(100vw - 300px)" : "100vw",
          }}
          autoPlay
          id="video"
          ref={VideoRef}
        >
          <source
            src={API_ENDPOINT + "/media/roomplaying/" + roomId}
            type="video/mp4"
            id="source"
          />
          Your browser does not support the video tag.
        </video>
        <div className={chatopen === true ? "flex w-[300px]" : "hidden"}>
          <Chat />
        </div>
      </div>
    </div>
  );
};
