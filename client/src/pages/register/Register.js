import axios from "axios";
import { useRef } from "react";
import { useState } from "react";
import "./register.css";
import Swal from "sweetalert2";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [form, setForm] = useState(false);

  const handleStart = async (e) => {
    e.preventDefault();
    try {
      await axios.post("auth/checkemail", { email, username })
      .then((res) => {
        if(res.data.status){
            setForm(true);
        }
        else{
            Swal.fire("Error", res.data.message, "error");
        }
      })
    } catch (err) {
      Swal.fire("Error", err.response.data, "error");
    }
  };
  const handleFinish = async (e) => {
    e.preventDefault();
    try {
      await axios.post("auth/register", { email, username, password });
      Swal.fire(
        "success",
        "Successfully Registred, Please Log in!",
        "success"
      )
      window.location.replace("/login");
    } catch (err) {

    }
  };

  return (
    <div className="text-center pt-4">
      <main className="form-signin w-100 m-auto">
        <form>
          <img
            className="mb-4"
            src="https://img.icons8.com/color/344/user-account-skin-type-7.png"
            alt=""
            width="72"
            height="57"
          />
          <h1 className="h3 mb-3 fw-normal">Please sign up</h1>
          {!form ? (
            <>
              <div className="form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="hunter2"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="floatingInput">Username</label>
              </div>
              <button
                className="w-100 btn btn-lg btn-primary"
                type="submit"
                onClick={handleStart}
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <div className="form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  readOnly
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="hunter2"
                  value={username}
                  readOnly
                />
                <label htmlFor="floatingInput">Username</label>
              </div>
              <div className="form-floating mb-2">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>

              <button
                className="w-100 btn btn-lg btn-primary"
                type="submit"
                onClick={handleFinish}
              >
                Sign Up
              </button>
            </>
          )}

          <p className="mt-5 mb-3">
            Already Registered? <a href="/login">Login</a>
          </p>
        </form>
      </main>
    </div>
  );
}
