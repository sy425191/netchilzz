import axios from "axios";

const Mediatable = ({ media, index }) => {
  const deleteHandler = () => {
    try {
      axios
        .post(
          "/admin/deletemedia",
          { id: media._id },
          {
            headers: { token: "Bearer " + localStorage.getItem("token") },
          }
        )
        .then((res) => {
          console.log(res.data);
          window.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{media.title}</td>
      <td>
        {media.type === "audio" ? (
          <span className="badge bg-success">Audio</span>
        ) : (
          <span className="badge bg-primary">Video</span>
        )}
      </td>
      <td>{media.user.username}</td>
      <td>{new Date(media.createdAt).toDateString()}</td>
      <td>
        <button className="btn btn-danger mx-3" onClick={deleteHandler}>Delete</button>
      </td>
    </tr>
  );
};

export default Mediatable;
