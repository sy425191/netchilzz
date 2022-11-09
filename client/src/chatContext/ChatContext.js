import { createContext, useEffect,useState } from "react";

export const chatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chatStatus =
    localStorage.getItem("chatStatus") !== "undefined"
      ? JSON.parse(localStorage.getItem("chatStatus"))
      : false;
  const [chatopen, setChatOpen] = useState(chatStatus);

  const chatToggle = () => {
    setChatOpen(!chatopen);
  };

  useEffect(() => {
    localStorage.setItem("chatStatus", JSON.parse(chatopen));
  }, [chatopen]);

  return (
    <chatContext.Provider value={{ chatopen, setChatOpen, chatToggle }}>
      {children}
    </chatContext.Provider>
  );
};
