import { useEffect, useState } from "react";
const AudioPlayer = ({ audioUrl, imgUrl }) => {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    setAudio(audioUrl);
    const audioElem = document.getElementById("audio");
    audioElem.src = audioUrl;
    audioElem.setAttribute("controlsList", "nodownload");
  }, [audioUrl]);

  return (
    // full screen audio player
    <div className="audio-player">
        <video controls autoPlay id="audio" style={{ width: "100%", height: "70vh", backgroundColor: "grey" }} poster={imgUrl} >
            <source type="audio/mp3" />
        </video>
    </div>
  );
};

export default AudioPlayer;