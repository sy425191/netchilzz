import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { async } from "@firebase/util";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  const handleCreate = () => {
    // swal form for one input
    Swal.fire({
      title: "Create a new playlist",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Create",
      showLoaderOnConfirm: true,
      preConfirm: async (playlistName) => {
        // create playlist
        return await axios.post(
          "/playlist/add",
          { playlistName },
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // add new playlist to state
        setPlaylists([...playlists, result.value]);
      }
    });
  };

  useEffect(() => {
    const getPlaylists = async () => {
        try {
            const res = await axios.get("/playlist/get", {
                headers: {
                    token:
                        "Bearer " +
                        JSON.parse(localStorage.getItem("user")).accessToken,
                },
            });
            setPlaylists(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    getPlaylists();
    }, []);

  return (
    <Layout>
      <div className="w-100 d-flex justify-content-end">
        <a className="btn btn-primary" onClick={handleCreate}>
          Create Playlist
        </a>
      </div>
      <div className="container"></div>
    </Layout>
  );
};

export default Playlists;
