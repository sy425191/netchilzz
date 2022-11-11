import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Mediatable from '../components/MediaTable';
import Navbar from '../components/Navbar';

const Dashboard = () => {

    const navigate=useNavigate();
    const [mediaState, setMediaState] = useState([]);

    useEffect(() => {
      try {
        axios
          .post(
            "/admin/getmedia",
            {},
            {
              headers: { token: "Bearer " + localStorage.getItem("token") },
            }
          )
          .then((res) => {
            console.log(res.data);
            setMediaState(res.data);
          });
      } catch (error) {
        console.log(error);
      }
    }, []);

  return (
    <>
      <Navbar/>
      <div className='container'>
        <h2>Dashboard</h2>

        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>#</th>
                <th>Media Name</th>
                <th>Media Type</th>
                <th> User</th>
                <th> Added On </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody>
              {mediaState.map((media, index) => (
                <Mediatable index={index} media={media} />
              ))}
            </tbody>
          </table>
          </div>
      </div>
    </>
  )
}

export default Dashboard
