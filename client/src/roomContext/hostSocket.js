import { createContext } from "react";

export const hostContext = createContext();

export const HostProvider = ({ children, socket, roomId }) => {
    const playMedia = (data) => {
        socket.emit("playMedia", {roomId});
    }

    const pauseMedia = () => {
        socket.emit("pauseMedia", {roomId});
    }

    const timeStamp = (data) => {
        const {timeStamp} = data;
        socket.emit("timeStamp", {roomId, timeStamp});
    }

    const PlayBackRate = (data) => {
        const {playbackRate} = data;
        alert(playbackRate);
        socket.emit("playBackRate", {roomId, playbackRate});
    }

    const changeVideo = () => {
        socket.emit("changeVideo", {roomId});
    }
    
    const endRoom = () => {
        socket.emit("endRoom", {roomId});
    }

    return (
        <hostContext.Provider value={{ playMedia, pauseMedia, timeStamp, PlayBackRate, endRoom, changeVideo }}>
            {children}
        </hostContext.Provider>
    )
}

