import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../authContext/AuthContext";
import Card from "../../components/card/Card";
import Layout from "../../components/layout/Layout";

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const { data } = await axios.post(
          "/user/favorites/",
          {},
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        setFavorites(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getFavorites();
  }, []);

  return (
    <Layout>
      <div className="favorites">
        <div className="row">
          {favorites.map((favorite) => (
            <Card key={favorite._id} item={favorite} />
          ))}
        </div>
      </div>

      {
        // if no search results
         favorites.length === 0 && (
          <div className="d-flex justify-content-center align-items-center" style={{height:"70vh"}}>
            <h2
              style={{
                color: "white",
                background: "rgba(0,0,0,0.5)",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              No results found
            </h2>
          </div>
        )
      }
    </Layout>
  );
};

export default Favorites;
