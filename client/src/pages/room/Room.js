import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Chat from "../../components/streaming/Chat";
import StreamPlayer from "../../components/player/StreamPlayer";

const Room = () => {
  const { roomId } = useParams();
  return (
    
      <div className="row mt-3 w-100">
        <div className="col-12 col-md-9">
        <StreamPlayer />
        </div>
        <div className="col-12 col-md-3">
          <Chat />
        </div>
      </div>
    
  );
};

export default Room;
