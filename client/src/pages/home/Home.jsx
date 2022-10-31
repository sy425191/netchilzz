import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layout/Layout";
import Card from "../../components/card/Card";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Layout>
    <div className="home">
        </div>
    </Layout>
  );
};

export default Home;