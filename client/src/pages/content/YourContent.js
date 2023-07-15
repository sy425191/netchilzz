import axios from "axios";
import { useEffect, useState } from "react";
import Card from "../../components/card/Card";
import Layout from "../../components/layout/Layout";
import API_ENDPOINT from "../../apiContext/apiEndpoint";

const YourContent = () => {

    const [media, setMedia] = useState([])

    useEffect(() => {
        try{
            axios.get(API_ENDPOINT+"/media/userAll", {
                headers: {
                    token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
                }
            }).then((res) => {
                setMedia(res.data)
            })
        
        }catch(err){
            console.log(err)
        }
    }, [])

  return (
    <Layout>
      {/* showing user content in form of cards */}
      <div className="row">
        {
            media.map((item) => {
                item.username = JSON.parse(localStorage.getItem("user")).username
                return (<Card key={item._id} item={item} /> )
            })
        }
      </div>
    </Layout>
  );
};

export default YourContent;
