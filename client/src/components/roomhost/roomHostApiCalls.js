import axios from "axios";
import API_ENDPOINT from "../../apiContext/apiEndpoint";

export const searchMedia = async (searchTerm) => {
    try {
        const res = await axios.post(
          API_ENDPOINT+ "/media/search",
          {
            query: searchTerm,
            sort: "",
            filter: "all"
          },
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        return res;
      } catch (err) {
        console.log(err);
      }
};

export const getRoomDetails = async (roomId) => {
    try {
        const res = await axios.get(API_ENDPOINT+`/room/${roomId}`, {
          headers: {
            token:
              "Bearer " +
              JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        return res['data'];
      } catch (err) {
        console.log(err);
      }
};