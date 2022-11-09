import axios from "axios";

export const searchMedia = async (searchTerm) => {
    try {
        const res = await axios.post(
          "/media/search",
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
