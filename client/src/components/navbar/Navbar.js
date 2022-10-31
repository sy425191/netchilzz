import "./navbar.css";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));    
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-between my-1 d-none d-md-flex">
      <div>
        <a href="/">Home</a>
      </div>
      <div className="d-flex justify-content-center">
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          id="navbar-search"
        />
        <button
          className="btn btn-outline-success my-2 my-sm-0 mx-2"
          type="submit"
        >
          Search
        </button>
      </div>
      <div className="d-flex">
        <a className="btn btn-outline-primary mx-1" href="/upload" >Upload</a>
        <a className="btn btn-outline-danger mx-1">Create Room</a>
        <div className="dropdown mx-1">
          <button
            className="btn btn-outline-success dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {user.username}
          </button>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" href={'/user/' +user.username}>
                Your Content
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Stream History
              </a>
            </li>
            <hr />
            <li>
              <a className="dropdown-item" href="#">
                Logout <i className="fa fa-sign-out"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
