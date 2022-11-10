import React from 'react'
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';

const Dashboard = () => {

    const navigate=useNavigate();

  return (
    <>
      <Navbar/>
      <div className='container'>
        <h2>Dashboard</h2>
      </div>
    </>
  )
}

export default Dashboard
