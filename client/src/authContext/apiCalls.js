import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";
import Swal from "sweetalert2";
import API_ENDPOINT from "../apiContext/apiEndpoint";

export const login = async (user, dispatch) => {
  
  dispatch(loginStart());
  try {
    const res = await axios.post(API_ENDPOINT+"/auth/login", user);
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