import { createContext, useEffect, useState } from "react";

const AdminContext = createContext();

export default AdminContext;

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    } else {
        setToken(null);
    }
  }, []);

  return (
    <AdminContext.Provider value={{ token }}>
      {children}
    </AdminContext.Provider>
  );
};
