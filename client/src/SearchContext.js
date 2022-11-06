import { createContext, useState } from "react";

export const searchContext = createContext();

export const SearchContextProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <searchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </searchContext.Provider>
  );
};
