import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";
import Swal from "sweetalert2";

export const login = async (user, dispatch) => {
  
  dispatch(loginStart());
  try {
    const res = await axios.post("auth/login", user);
    dispatch(loginSuccess(res.data));
    window.location.replace("/");
  } catch (err) {
    dispatch(loginFailure());
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response.data
    });
  }
};