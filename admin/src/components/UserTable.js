import axios from "axios";
import { useState } from "react";

const UserTable = ({ user, index }) => {
  const [banState, setBanState] = useState(!user.status);

  const deleteUser = (e) => {
    // get tge id of the user
    const id = e.target.attributes.getNamedItem("data-id").value;
    try {
      axios
        .post(
          "/admin/deleteuser",
          { id },
          {
            headers: { token: "Bearer " + localStorage.getItem("token") },
          }
        )
        .then((res) => {
          window.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const banUser = (e) => {
    const id = e.target.attributes.getNamedItem("data-id").value;
    try {
      axios
        .post(
          "/admin/banuser",
          { id, status: banState },
          {
            headers: { token: "Bearer " + localStorage.getItem("token") },
          }
        )
        .then((res) => {
            setBanState(!banState);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>
        {banState === false ? (
          <span className="badge bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Inactive</span>
        )}
      </td>
      <td>{new Date(user.createdAt).toDateString()}</td>
      <td>
        <button
          className="btn btn-warning mx-2"
          data-id={user._id}
          onClick={banUser}
        >
            {banState === true ? "Unban" : "Ban"}
        </button>
        <button
          className="btn btn-danger"
          data-id={user._id}
          onClick={deleteUser}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default UserTable;
