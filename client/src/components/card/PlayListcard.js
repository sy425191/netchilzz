import axios from "axios";
import { useEffect, useState } from "react";
import API_ENDPOINT from "../../apiContext/apiEndpoint";

const PlayListCard = ({ item }) => {
  const playListHandler = async () => {
    window.location.href = `/playlists/${item._id}`;
  };

  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://via.placeholder.com/150"
  );

  useEffect(() => {
    const getFirstMediaThumbnail = async () => {
      if (item.media.length === 0) {
        return;
      }

      let mediaID = item.media[0];

      try {
        const res = await axios.post(
          API_ENDPOINT + "/media/get",
          { mediaId: mediaID },
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        setThumbnailUrl(res.data.imgUrl);
      } catch (error) {
        console.error("Error fetching media thumbnail:", error);
      }
    };

    getFirstMediaThumbnail();
  }, [item.media]);

  return (
    <div
      className="relative w-full h-48 flex flex-row justify-between border-2 border-cyan-500/20 rounded cursor-pointer"
      onClick={playListHandler}
    >
      <div className="w-full h-full absolute top-0 left-0 bg-slate-600/40 rounded-l" />
      <img src={thumbnailUrl} alt="" className="w-full h-full rounded-l" />
      <div className="absolute top-0 left-0 text-sm text-slate-500 bg-slate-100 rounded-br-sm py-1 px-1 text-lowercase">
        <span> /{item.name} </span>
      </div>
    </div>
  );
};

export default PlayListCard;
