"use client";
import { createContext, useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { socket } from "@/utils/socket";

const SocketContext = createContext();

export function SocketContextProvider({ children }) {
  const [connected, setConnected] = useState(socket.connected);
  const [gameState, setGameState] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onUpdateGameState(newState) {
      setGameState(newState);
    }

    function onMessage(message) {
      setMessages([message].concat(messages));
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("updateGameState", onUpdateGameState);
    socket.on("message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("updateGameState", onUpdateGameState);
      socket.off("message", onMessage);
    };
  }, [messages]);

  if (!connected) return <Loading message="Connecting to server..." />;

  return (
    <SocketContext.Provider value={{ gameState, messages }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContext;
