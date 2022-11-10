const PlayListCard = ({ item }) => {
  const playListHandler = async () => {
    window.location.href = `/playlists/${item._id}`;
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-secondary text-white rounded mx-3 my-3"
      style={{
        height: "100px",
        width: "200px",
        minWidth: "200px",
        cursor: "pointer",
      }}
      onClick={playListHandler}
    >
      <span> {item.name} </span>
    </div>
  );
};

export default PlayListCard;
