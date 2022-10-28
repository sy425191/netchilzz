import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
    <div className="home">
        <h2 className="pageTitle">Welcome Home, {user.username}</h2>
    </div>
    </>
  );
};

export default Home;