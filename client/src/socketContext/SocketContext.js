import { createContext } from "react";
import io from "socket.io-client";

const ENDPOINT = "http://72.167.42.107:8000/";

const accessToken = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).accessToken : null;

export const socket = io(ENDPOINT, {
  extraHeaders: {
    token: "Bearer " + accessToken,
  },
});

export default createContext(socket);
