import { useContext } from "react";
import { searchContext } from "../../App";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Get user from local storage
  const navigate = useNavigate();
  
  const search = useContext(searchContext); // Get search query from search context

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from local storage
    navigate("/login"); // Navigate to login page
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.searchQuery) {
      navigate(`/search?query=${encodeURIComponent(search.searchQuery)}`);
    }
  };

  // if / is pressed
  const handleKeyDown = (e) => {
    if (e.key === "/") {
      e.preventDefault();
      document.getElementById("navbar-search").focus();
    }
    if(e.key === "Enter"){
      handleSearch(e);
    }

    if(e.key === "Escape"){
      document.getElementById("navbar-search").blur();
    }
  };

  window.onkeypress = handleKeyDown;
  // implementing the speech recognition
  const handleSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start((e) => {
      alert("error");
    });
    recognition.onstart = () => {
      Swal.fire({
        icon: "info",
        title: "Listening...",
        allowOutsideClick: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
    };

    recognition.onresult = (e) => {
      Swal.close();
      const transcript = e.results[0][0].transcript;
      search.setSearchQuery(transcript);
      navigate(`/search?query=${encodeURIComponent(transcript)}`);
    };

    recognition.onerror = (e) => {
      Swal.close();
      switch (e.error) {
        case "not-allowed":
          Swal.fire({ icon: "error", title: "Permission denied" });
          break;
        case "no-speech":
          Swal.fire({ icon: "error", title: "No speech detected" });
          break;
        case "aborted":
          Swal.fire({ icon: "error", title: "Speech aborted" });
          break;
        case "network":
          Swal.fire({ icon: "error", title: "Network error" });
          break;
        case "audio-capture":
          Swal.fire({ icon: "error", title: "Audio capture error" });
          break;
        default:
          Swal.fire({ icon: "error", title: "Something went wrong" });
          break;
      }
    };
    // if permission is not granted
    if (recognition.onspeechend) {
      recognition.stop();
    }
  };

  return (
    <div className="d-flex justify-content-between my-1 d-none d-md-flex">
      <div className="back_button">
        <a href="/">
          <span className="back_arrow" style={window.location.pathname=="/" ? {display:"none"} : {}}></span> <span> Home </span>
        </a>
      </div>
      <div className="d-flex justify-content-center">
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          id="navbar-search"
          style={{ width: "300px" }}
          value={search.searchQuery}
          onChange={(e) => search.setSearchQuery(e.target.value)}
        />
        <button
          className="btn btn-outline-success my-2 my-sm-0"
          onClick={handleSearch}
        >
          <i className="fa fa-search"></i>
        </button>
        {/* voice search icon */}
        <button
          className="btn btn-outline-danger my-2 my-sm-0 mx-2"
          type="submit"
          onClick={handleSpeech}
        >
          <i className="fa fa-microphone"></i>
        </button>
      </div>
      <div className="d-flex">
        <a className="btn btn-outline-danger mx-2" href="/room">
          Rooms
        </a>

        <a className="btn btn-outline-primary mx-1" href="/upload">
          Upload
        </a>
        <div className="dropdown mx-1">
          <button
            className="btn btn-outline-success dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {user.username}
          </button>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" href={"/user/" + user.username}>
                My Content
              </a>
            </li>
            {/* <li>
              <a className="dropdown-item" href="#">
                Stream History
              </a>
            </li> */}
            <li>
              <a className="dropdown-item" href="/favorites">
                Favorites
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="/playlists">
                Playlists
              </a>
            </li>
            <hr />
            <li>
              <a className="dropdown-item" href="#" onClick={handleLogout}>
                Logout <i className="fa fa-sign-out"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
