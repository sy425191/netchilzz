import axios from "axios";
import Swal from "sweetalert2";
import API_ENDPOINT from "../../apiContext/apiEndpoint";

export const like = async (userId, mediaId) => {
  try {
    await axios.put(
      API_ENDPOINT+`/media/${mediaId}/like`,
      {
        userId,
      },
      {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const dislike = async (userId, mediaId) => {
  try {
    await axios.put(
      API_ENDPOINT+`/media/${mediaId}/dislike`,
      {
        userId,
      },
      {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};