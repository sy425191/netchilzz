import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

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

  const deleteUser = () => {
    try {
      axios
        .post(
          "/admin/deleteuser",
          { id },
          {
            header: { token: "Bearer " + localStorage.getItem("token") },
          }
        )
        .then((res) => {
            window.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const banUser = (id) => {
    try {
        axios
            .post(
                "/admin/banuser",
                { id },
                {
                    header: { token: "Bearer " + localStorage.getItem("token") },
                }
            )
            .then((res) => {
                window.location.reload();
            });
    } catch (error) {
        console.log(error);
    }
};


  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">Users</h2>
        <table className="table" id="dt">
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
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {user.status === true ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">Inactive</span>
                  )}
                </td>
                <td>{new Date(user.createdAt).toDateString()}</td>
                <td>
                  <button className="btn btn-warning mx-2"  data-id={user._id} onClick={banUser}>
                    Ban
                  </button>
                  <button className="btn btn-danger" data-id={user._id} onClick={deleteUser}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
