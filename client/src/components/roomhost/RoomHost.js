import "./RoomHost.css";
import { useContext, useEffect, useRef, useState } from "react";
import Chat from "../chat/Chat";
import SocketContext from "../../socketContext/SocketContext";
import RoomContext from "../../roomContext/roomContext";
import { chatContext } from "../../chatContext/ChatContext";
import { searchMedia } from "./roomHostApiCalls";
import StreamSearchCard from "../card/streamSearchCard/streamSearchCard";
import Swal from "sweetalert2";
import { AuthContext } from "../../authContext/AuthContext";
import { hostContext } from "../../roomContext/hostSocket";

export const RoomHost = ({ roomId }) => {
  const { chatopen, setChatOpen, chatToggle } = useContext(chatContext);
  const {playMedia, pauseMedia, timeStamp, PlayBackRate, changeVideo, endRoom, functions} = useContext(hostContext);
  const socket = useContext(SocketContext);
  const user = useContext(AuthContext);
  const { roomState, setRoomState, StreamMedia, setStreamMedia } =
  useContext(RoomContext);
  const VideoRef = useRef();

  const modelRef = useRef();
  const closeModal = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);


  const handleSelect = (e) => {
    e.preventDefault();
    var key = e.target.getAttribute("data-key");
    if (key === "undefined" || key === null) {
      // get to the parent .scard
      while (e.target.classList.contains("scard") === false) {
        e.target = e.target.parentElement;
        key = e.target.getAttribute("data-key");
      }
    }
    if (e.target.classList.contains("active")) {
      e.target.classList.remove("active");
      setSelectedMedia(null);
      return;
    }
    setSelectedMedia(searchResults.find((result) => result._id === key));
    var cards = document.querySelectorAll(".scard");
    cards.forEach((card) => {
      if (card.getAttribute("data-key") === key) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    searchContentHandler();
  };

  const searchContentHandler = (e) => {
    if (e !== undefined) {
      setSearchTerm(e.target.value);
      return;
    }
    searchMedia(searchTerm).then((data) => {
      setSearchResults(data.data);
    });
  };

  const selectMediaHandler = () => {
    if (selectedMedia === null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a media to play",
      });
      return;
    }
    setStreamMedia({
      url: selectedMedia.mediaUrl,
      id: selectedMedia._id,
    });
    socket.emit("PlayInRoom", {
      roomId: roomId,
      userId: user.user._id,
      mediaId: selectedMedia._id,
    });
    setTimeout(() => {
      VideoRef.current.src = selectedMedia.mediaUrl;
      VideoRef.current.play();
    }, 1220);
    changeVideo();
    closeModal.current.click();
  };
  

  return (
    <>
      <div className="room_host">
        <div className="room_host__container">
          <span>Hosted by You</span>
          <span className="room_host__container__host">
            <button
              className="btn btn-outline-primary mx-2"
              data-bs-toggle="modal"
              data-bs-target="#selectMediaModal"
            >
              Stream Content
            </button>
            <button className="btn btn-outline-danger mx-2">
              Settings <i className="fa fa-cog"></i>
            </button>
            <button
              className={
                "btn mx-2 " +
                (chatopen === true ? "btn-success" : "btn-outline-success")
              }
              onClick={chatToggle}
            >
              Chat <i className="fa fa-comment"></i>
            </button>
          </span>
        </div>
        <div className="room_host__body" style={{ overflowY: "scroll" }}>
          <div className="content-player">
            <video
              ref={VideoRef}
              controls
              className=""
              autoPlay
              width={"100%"}
              height={"90%"}
              id="video"
              onPlay={playMedia}
              onPause={pauseMedia}
              onSeeked ={timeStamp}
              onRateChange={PlayBackRate}
              onEnded={endRoom}
              onTimeUpdate={(e) => {functions.setCurrentTime(e.target.currentTime)}}
            >
              <source src={StreamMedia.url} type="video/mp4" />
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

      <div
        className="modal fade"
        id="selectMediaModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="selectModalLabel"
        aria-hidden="true"
        ref={modelRef}
        style={{ maxHeight: "600px", overflowY: "scroll" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="container">
                <form
                  className="g-3 d-flex justify-content-center"
                  onSubmit={submitHandler}
                >
                  <div
                    className="input-group mb-3"
                    style={{ maxWidth: "300px" }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Content to Stream"
                      onChange={searchContentHandler}
                    />
                    <button
                      type={"submit"}
                      className="btn btn-outline-secondary"
                    >
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </form>
              </div>
              <div className="container">
                {searchResults.map((result) => {
                  return StreamSearchCard({ result, handleSelect });
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={selectMediaHandler}
              >
                Play <i className="fa fa-play"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
