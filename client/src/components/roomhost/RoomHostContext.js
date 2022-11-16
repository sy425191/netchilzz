import { createContext, useContext } from "react";
import SocketContext from "../../socketContext/SocketContext";

const RoomHostContext = createContext();

export default RoomHostContext;

export const RoomHostProvider = ({ children, roomId }) => {
  const socket = useContext(SocketContext);

  const playVideo = () => {
    socket.emit("playVideo", roomId);
  };

  
  const value = {
    playVideo,
    };

  return (
    <RoomHostContext.Provider value={value}>
      {children}
    </RoomHostContext.Provider>
  );
};
