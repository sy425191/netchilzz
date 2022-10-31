import Navbar from "../navbar/Navbar";
import "./layout.css";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="p-3"> {children}</main>
    </div>
  );
};

export default Layout;
