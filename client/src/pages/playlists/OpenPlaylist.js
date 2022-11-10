import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import PlayListVideo from "../../components/card/PlayListVideo";
import SearchCard from "../../components/card/SearchCard";
import Layout from "../../components/layout/Layout";

const OpenPlayList = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState({
    userId: "",
  });
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const [playListAdmin, setPlayListAdmin] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    axios
      .post(
        "/user/getuserpublic",
        { userId: playlist.user },
        {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        }
      )
      .then((res) => {
        setPlayListAdmin(res.data);
      });
  }, [playlist]);

  const deletePlaylist = () => {
    axios
      .post(
        "/playlists/delete/",
        { playlistId: id },
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
          text: "Playlist deleted successfully",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          window.location.replace("/playlists");
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
    const fetchPlaylist = async () => {
      const res = axios
        .post(
          "/playlists/get",
          {
            playlistId: id,
          },
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        )
        .then((res) => {
          setPlaylist(res.data);
          setMedia(res.data.media);
          setLoading(false);
        })
        .catch((err) => {
          window.location.replace("/playlists");
        });
    };
    fetchPlaylist();
  }, [id]);

  if (loading) {
    return <Layout>Loading...</Layout>;
  }
  return (
    <Layout>
      <div className="row">
        <div className="col-12 col-md-7">
          {media.map((media) => (
            <PlayListVideo mediaId={media} playlistId={id} />
          ))}
        </div>
        <div className="col-12 col-md-5 px-4  py-3 bg-secondary text-white rounded">
          <div className="d-flex justify-content-between align-items-center">
            <h5>{playlist.name}</h5>
            <div className="d-flex align-items-center">
              <a className="btn btn-primary me-2" onClick={deletePlaylist}>
                delete <i className="fa fa-trash"></i>
              </a>
            </div>
          </div>
          <div className="mt-3 p-4 border rounded d-flex">
            <div className="d-flex align-items-center">
              <img
                src={
                  "https://ui-avatars.com/api/?name=" + playListAdmin.username
                }
                className="img rounded mx-3"
                style={{ width: "25px", height: "25px" }}
              ></img>
              <span className="mx-2">
                Playlist By :{" " + playListAdmin.username}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OpenPlayList;
