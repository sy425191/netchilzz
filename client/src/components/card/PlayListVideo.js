import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { date_to_days, TrimVar } from "../functions";
const audefault = require("./audefault.png");
const videfault = require("./videfault.png");

const PlayListVideo = ({ playlistId, mediaId }) => {
  const [item, setItem] = useState({
    _id: "",
    title: "",
    username: "",
    imgUrl: "",
    mediaUrl: "",
    type: "",
    description: "",
    createdAt: "",
    updatedAt: "",
    tags: [],
  });
  const handleCLick = () => {
    window.location.href = "/watch/" + { mediaId };
  };

  const deleteFromPlaylist = () => {
    axios
      .post(
        "/playlists/removefrom",
        { mediaId: mediaId, playlistId: playlistId },
        {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: "Media deleted successfully from playlist",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          text: err.response.data,
          icon: "error",
          confirmButtonText: "Ok",
        });
      });
  };

  useEffect(() => {
    axios
      .post(
        "/media/get",
        { mediaId: mediaId },
        {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        }
      )
      .then((res) => {
        setItem(res.data);
      });
  }, []);

  const loadImg = () => {
    return item.imgUrl;
  };

  return (
    <div
      className="card px-0 d-flex flex-md-row flex-column my-2"
      id={"card_" + item._id}
      style={{ width: "100%" }}
    >
      <div
        style={{
          position: "relative",
          width: "auto",
          minWidth: "300px",
          height: "200px",
          cursor: "pointer",
          background: `url("${item.imgUrl}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        onClick={handleCLick}
      >
        {/* background opaque 70% */}
        <i
          className={
            item.type == "audio"
              ? "fa fa-headphones p-2"
              : "fa fa-play-circle p-2"
          }
          style={{
            position: "absolute",
            top: "1%",
            left: "1%",
            fontSize: "20px",
            color: "white",
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: "10%",
          }}
        ></i>
      </div>
      <div className="p-3 d-flex flex-column justify-content-between">
        <div>
          <span
            className="card-title"
            onClick={handleCLick}
            style={{ cursor: "pointer", fontSize: "20px" }}
          >
            {TrimVar({ prop: item.title, length: 100 })}
          </span>{" "}
          <div className="d-flex flex-row">
            <div className="mx-2 d-flex justify-content-center mt-1">
              <img
                src={"https://ui-avatars.com/api/?name=" + item.username}
                className="img rounded"
                style={{ width: "25px", height: "25px" }}
              ></img>
            </div>
            <div className="px-3">
              <span className="py-3" style={{ opacity: 0.8, fontSize: "13px" }}>
                {TrimVar({ prop: item.username, length: 40 })}
              </span>{" "}
            </div>
          </div>
          <span className="pt-3" style={{ opacity: 0.9, fontSize: "14px" }}>
            {TrimVar({ prop: item.description, length: 160 })}
          </span>{" "}
          <br />
        </div>
        <div>
          <a
            className="btn btn-outline-danger mx-2"
            onClick={deleteFromPlaylist}
          >
            <i className="fa fa-trash fa-1.5x"></i>
          </a>
          {item.tags.map((tag, index) => {
            const maxTags = 6;
            return index >= maxTags ? null : (
              <span
                className="badge rounded-pill bg-dark mx-1"
                style={{ fontSize: "12px", background: "rgba(0,0,0,0.5)" }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayListVideo;
