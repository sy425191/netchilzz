import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import VideoPlayer from "../../components/player/VideoPlayer";
import AudioPlayer from "../../components/player/AudioPlayer";
import { TrimVar } from "../../components/functions";

const Watch = () => {
  const { mediaId } = useParams();
  const [mediaType, setMediaType] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const { data } = await axios.post(
          `/media/get`,
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
              <div className="media-info p-3" style={{
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: "10px",
              }}>
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
                  <button className="btn btn-outline-success">
                    <i className="fa fa-thumbs-up me-2"></i>{" "}
                    {media.upvotes.length}
                  </button>
                  <button className="btn btn-outline-danger ms-2">
                    <i className="fa fa-thumbs-down me-2"></i>{" "}
                    {media.downvotes.length}
                  </button>
                </div>
                <div>
                  <button className="btn btn-primary">
                    <i className="fa fa-share me-2"></i> Stream
                  </button>
                </div>
              </div>
              <div
                className="p-4"
                style={{
                  backgroundColor: "grey",
                  color: "white",
                  borderRadius: "10px",
                }}
              >
                <h5>Description:</h5>
                {media.description}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Watch;
