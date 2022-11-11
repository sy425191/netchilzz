import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";

export default function Users() {
  const [userState, setuserState] = useState([]);
  useEffect(() => {
    try {
      axios
        .post(
          "/admin/getusers",
          {},
          {
            headers: { token: "Bearer " + localStorage.getItem("token") },
          }
        )
        .then((res) => {
          console.log(res.data);
          setuserState(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);


  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">Users</h2>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>UserName</th>
              <th>email</th>
              <th>Status</th>
              <th>Added On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userState.map((user, index) => (
              <UserTable user={user} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
