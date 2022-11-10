import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./authContext/AuthContext";
import { createContext, useContext, useEffect, useState } from "react";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Upload from "./pages/upload/Upload";
import YourContent from "./pages/content/YourContent";
import Search from "./pages/search/Search";
import Watch from "./pages/watch/Watch";
import Playlists from "./pages/playlists/Playlists";
import NewRoom from "./pages/roomnew/Roomnew";
import Room from "./pages/room/Room";
import SocketContext, { socket } from "./socketContext/SocketContext";
import RoomContext from "./roomContext/roomContext";
import { ChatProvider } from "./chatContext/ChatContext";
import Favorites from "./pages/favorites/Favorites";

export const searchContext = createContext();

function App() {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState(""); // Search query to be paased to search page
  const [roomState, setRoomState] = useState({
    roomId: null,
    roomName: null,
    isHost: false,
    isJoined: false,
  });
  const [StreamMedia, setStreamMedia] = useState({
    url:
      localStorage.getItem("streamMedia") !== null || undefined
        ? JSON.parse(localStorage.getItem("streamMedia")).url
        : null,
  });

  useEffect(() => {
    localStorage.setItem("streamMedia", JSON.stringify(StreamMedia));
  }, [StreamMedia]);

  return (
    <searchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <Router>
        <SocketContext.Provider value={socket}>
          <ChatProvider>
            <RoomContext.Provider
              value={{ roomState, setRoomState, StreamMedia, setStreamMedia }}
            >
              <Routes>
                {/* check for register */}
                <Route path="/register" element={<Register />} />
                {/* check for login */}
                <Route path="/login" element={<Login />} />
                {/* check for user */}
                <Route
                  path="/"
                  element={user ? <Home /> : <Navigate to="/login" />}
                />
                {user && (
                  <>
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/user/:username" element={<YourContent />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/watch/:mediaId" element={<Watch />} />
                    <Route path="/playlists" element={<Playlists />} />
                    <Route path="/room" element={<NewRoom />} />
                    <Route path="/room/:roomId" element={<Room />} />
                  </>
                )}
              </Routes>
            </RoomContext.Provider>
          </ChatProvider>
        </SocketContext.Provider>
      </Router>
    </searchContext.Provider>
  );
}

export default App;
