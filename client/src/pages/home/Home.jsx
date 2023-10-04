import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layout/Layout";
import Card from "../../components/card/Card";
import ScrollView from "../../components/scrollview/ScrollView";
import API_ENDPOINT from "../../apiContext/apiEndpoint";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [content, setContent] = useState([]);
  useEffect(() => {
    axios
      .get(API_ENDPOINT + "/media/recommended", {
        headers: {
          token: `Bearer ${user.accessToken}`,
        },
      })
      .then((res) => {
        setContent(res.data);
      })
      .catch((err) => {
        setContent("Error: " + err);
      });
  }, []);

  return (
    <Layout>
      <div className="container">
        <div className="d-flex justify-content-evenly align-items-center flex-wrap mt-3">
          
          {content.map((item) => (
            <Card key={item.id} item={item} />
          ))}

        </div>
      </div>
    </Layout>
  );
};

export default Home;