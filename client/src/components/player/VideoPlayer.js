import { useEffect, useState } from "react";
const VideoPlayer = ({ videoUrl }) => {

  useEffect(() => {
    const videoElem = document.getElementById("video");
    videoElem.src = videoUrl;
    videoElem.setAttribute("controlsList", "nodownload");
  }, [videoUrl]);

  return (
    // full screen video player
    <div className="video-player">
      <video controls autoPlay id="video" style={{ width: "100%", height: "70vh", backgroundColor: "rgba(0,0,0,0.1)" }}>
        <source type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;