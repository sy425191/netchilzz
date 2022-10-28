import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./authContext/AuthContext";
import { useContext } from 'react';
import Home from './pages/home/Home';
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        {/* check for register */}
        <Route path="/register" element={<Register />} />
        {/* check for login */}
        <Route path="/login" element={<Login />} />
        {/* check for user */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
