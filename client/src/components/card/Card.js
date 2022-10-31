import axios from "axios";
import { useEffect, useState } from "react";
const audefault = require("./audefault.png");
const videfault = require("./videfault.png");
const Card = ({ key, item }) => {
  const handleCLick = () => {
    window.open(item.mediaUrl, "_blank");
  };

  const loadImg = () => {
    return item.imgUrl;
  };

  return (
    <div
      className="card px-0"
      id={"card_" + key}
      style={{ width: "300px" }}
      onClick={handleCLick}
    >
      <img
        src={loadImg()}
        className="card-img-top border"
        alt={item.title}
        style={{ width: "100%", height: "180px" }}
      />
      <div className="card-body">
        <div className="d-flex flex-row">
          <div className="mx-2">
            <img src="" style={{ width: "20px", height: "20px" }}></img>
          </div>
          <div className="">
            <p>{item.title}</p>
            <p>
              {item.streams} <i className="fa fa-eye"></i>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;
