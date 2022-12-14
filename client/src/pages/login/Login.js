import { useContext, useReducer, useState } from "react";
import { login } from "../../authContext/apiCalls";
import { AuthContext } from "../../authContext/AuthContext";
import "./login.css";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(AuthContext);
  const user = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields",
      });
      return;
    }
    login({ email, password }, dispatch);
  };
  return (
    <>
    <div className=" p-4 text-center bg-primary text-white">
        <h1>Netchilzz</h1>
        <p>A streaming platform</p>
      </div>

    <div className="text-center pt-4">
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleLogin}>
          <img
            className="mb-4"
            src="https://img.icons8.com/color/344/user-account-skin-type-7.png"
            alt=""
            width="72"
            height="57"
          />
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label for="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label for="floatingPassword">Password</label>
          </div>

          <button
            className="w-100 btn btn-lg btn-primary"
            type="submit"
          >
            Sign in
          </button>
          <p className="mt-5 mb-3">
            New here? <a href="/register">Register</a>
          </p>
        </form>
      </main>
    </div>
    </>
  );
}