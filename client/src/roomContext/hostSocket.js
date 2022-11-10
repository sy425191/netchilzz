import { createContext, useEffect, useState } from "react";

export const hostContext = createContext();

export const HostProvider = ({ children, socket, roomId }) => {
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeinSec, setCurrentTimeinSec] = useState(0);

    useEffect(() => {
        if(parseInt(currentTimeinSec) === parseInt(currentTime)){
            return;
        }
        setCurrentTimeinSec(parseInt(currentTime));
    }, [currentTime]);

  const functions = {
    playbackRate,
    setPlaybackRate,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
  };

  useEffect(() => {
    localStorage.setItem(
      roomId,
      JSON.stringify({
        playbackRate,
        currentTime,
        isPlaying,
      })
    );
  }, [playbackRate, currentTimeinSec, isPlaying]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(roomId));
    if (data) {
      setPlaybackRate(data.playbackRate);
      setCurrentTime(data.currentTime);
      setIsPlaying(data.isPlaying);
      const videoelem = document.getElementById("video");
      videoelem.playbackRate = playbackRate;
      videoelem.currentTime = currentTime;
      if (functions.play) {
        videoelem.play();
      } else {
        videoelem.pause();
      }
    }
  }, []);

  useEffect(() => {
      const interval = setInterval(() => {
      socket.emit("sync", { 
          roomId,
          playbackRate,
          currentTimeinSec,
          isPlaying
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [playbackRate, currentTimeinSec, isPlaying]);

  const playMedia = (data) => {
    setIsPlaying(true);
    socket.emit("playMedia", { roomId });
  };

  const pauseMedia = () => {
    setIsPlaying(false);
    socket.emit("pauseMedia", { roomId });
  };

  const timeStamp = (data) => {
    const { currentTime } = data.target;
    socket.emit("timeStamp", { roomId, currentTime });
    console.log(currentTime);
  };

  const PlayBackRate = (data) => {
    setPlaybackRate(data.target.playbackRate);
    const { playbackRate } = data.target;
    socket.emit("playBackRate", { roomId, playbackRate });
  };

  const changeVideo = () => {
    socket.emit("changeVideo", { roomId });
  };

  const endRoom = () => {
    socket.emit("endRoom", { roomId });
  };

  return (
    <hostContext.Provider
      value={{
        playMedia,
        pauseMedia,
        timeStamp,
        PlayBackRate,
        endRoom,
        changeVideo,
        functions,
      }}
    >
      {children}
    </hostContext.Provider>
  );
};
