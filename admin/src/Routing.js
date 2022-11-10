import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import AdminContext from "./AdminContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Users from "./pages/Users";

export default function Routing() {
  const { token } = useContext(AdminContext);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {token && (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
        </>
      )}
    </Routes>
  );
}
