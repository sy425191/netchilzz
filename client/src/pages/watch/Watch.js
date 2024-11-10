import axios from "axios";
import { json, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Layout from "../../components/layout/Layout";
import VideoPlayer from "../../components/player/VideoPlayer";
import AudioPlayer from "../../components/player/AudioPlayer";
import { TrimVar } from "../../components/functions";
import { AuthContext } from "../../authContext/AuthContext";
import { like, dislike } from "./watchApiCalls";
import AddToPlaylist from "./AddToPlaylist";
import API_ENDPOINT from "../../apiContext/apiEndpoint";

const Watch = () => {
  const user = useContext(AuthContext);
  const { mediaId } = useParams();
  const [mediaType, setMediaType] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [media, setMedia] = useState([
    {
      title: "",
      username: "",
      imgUrl: "",
      mediaUrl: "",
      type: "",
      description: "",
    },
  ]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [disliked, setDisliked] = useState(false);
  const [dislikes, setDislikes] = useState(0);

  const favoriteToggle = () => {
    if (isFavorite === false) {
      setIsFavorite(true);
      axios
        .post(
          API_ENDPOINT+"/user/addtoFavorites",
          { mediaId: mediaId },
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      setIsFavorite(false);
      axios
        .post(
          API_ENDPOINT+"/user/removefromFavorites",
          { mediaId: mediaId },
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  };

  const likeHandler = () => {
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    } else {
      setLiked(true);
      setLikes(likes + 1);
    }
    if (disliked) {
      setDisliked(false);
      setDislikes(dislikes - 1);
    }
    like(user.user._id, mediaId);
  };

  const dislikeHandler = () => {
    if (disliked) {
      setDisliked(false);
      setDislikes(dislikes - 1);
    } else {
      setDisliked(true);
      setDislikes(dislikes + 1);
    }
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    }
    dislike(user.user._id, mediaId);
  };

  const downloadMedia = () => {
    const link = document.createElement("a");
    link.href = API_ENDPOINT+"/media/forcedownload/" + mediaId;
    link.setAttribute("download", media.title);
    document.body.appendChild(link);
    link.click();
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const { data } = await axios.post(
          API_ENDPOINT+`/media/get`,
          {
            mediaId,
          },
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        setLoading(false);
        setMedia(data);
        setMediaType(data.type);
        setMediaUrl(data.mediaUrl);
        setLiked(data.upvotes.includes(user.user._id));
        setLikes(data.upvotes.length);
        setDisliked(data.downvotes.includes(user.user._id));
        setDislikes(data.downvotes.length);
      } catch (error) {
        console.log(error);
      }

      try {
        const { data } = await axios.post(
          API_ENDPOINT+"/user/isFavorite",
          { mediaId },
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        setIsFavorite(data);
      } catch (error) {
        console.log(error);
      }
    };
    getMedia();
  }, [mediaId]);

  return (
    <Layout>
      <div className="row">
        <div className="col-12">
          {mediaType === "video" && <VideoPlayer videoUrl={mediaUrl} />}
          {mediaType === "audio" && (
            <AudioPlayer audioUrl={mediaUrl} imgUrl={media.imgUrl} />
          )}
        </div>
        {!loading && (
          <>
            <div className="col-12">
              {media.tags.map((tag, index) => (
                <span key={index} className="badge bg-primary me-1">
                  {tag}
                </span>
              ))}
            </div>
            <div className="col-12 col-md-8 p-4">
              <div
                className="media-info p-3"
                style={{
                  backgroundColor: "rgba(0,0,0,0.05)",
                  borderRadius: "10px",
                }}
              >
                <h3 className="text my-1">{media.title}</h3>
                <div className="d-flex align-items-center">
                  <img
                    src={"https://ui-avatars.com/api/?name=" + media.username}
                    className="img rounded"
                    style={{ width: "25px", height: "25px" }}
                  ></img>
                  <span className="mx-2">{media.username}</span>
                  <span className="mx-2">{media.streams} streams</span>
                </div>
              </div>
              <div
                className="my-2 p-3"
                style={{
                  backgroundColor: "rgba(0,0,0,0.05)",
                  borderRadius: "10px",
                }}
              >
                {!isFavorite ? (
                  <a
                    className="btn btn-outline-danger"
                    onClick={favoriteToggle}
                  >
                    <i className="fa fa-heart"></i> Add to Favorites
                  </a>
                ) : (
                  <a className="btn btn-danger" onClick={favoriteToggle}>
                    <i className="fa fa-heart"></i> Remove from Favorites
                  </a>
                )}

                <a className="btn btn-outline-primary mx-2" data-bs-toggle="modal" data-bs-target="#addToPlaylistModal">
                  <i className="fa fa-plus"></i> Add to Playlist
                </a>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div
                className="p-2 mb-3 d-flex justify-content-between"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  color: "white",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <button
                    className={
                      "btn " +
                      (liked === true ? "btn-success" : "btn-outline-success")
                    }
                    onClick={likeHandler}
                  >
                    <i className="fa fa-thumbs-up me-2"></i> {likes}
                  </button>
                  <button
                    className={
                      "btn ms-2 " +
                      (disliked === true ? "btn-danger" : "btn-outline-danger")
                    }
                    onClick={dislikeHandler}
                  >
                    <i className="fa fa-thumbs-down me-2"></i> {dislikes}
                  </button>
                </div>
                <div>
                  <a className="btn btn-primary" href={"/room"}>
                    <i className="fa fa-share me-2"></i> Stream
                  </a>
                  <a className="btn btn-success mx-1" onClick={downloadMedia}>
                    <i className="fa fa-download"></i>
                  </a>
                </div>
              </div>
              <div
                className="p-4"
                style={{
                  backgroundColor: "grey",
                  color: "white",
                  borderRadius: "10px",
                  maxHeight: "300px",
                  overflowY: "scroll",
                }}
              >
                <h5>Description:</h5>
                {media.description}
              </div>
            </div>
          </>
        )}
      </div>
      <AddToPlaylist mediaId={mediaId} />
    </Layout>
  );
};

export default Watch;
