"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/utils/socket";

const SocketContext = createContext();

export function SocketContextProvider({ children }) {
  const [connected, setConnected] = useState(socket.connected);
  const [gameState, setGameState] = useState(null);
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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("updateGameState", onUpdateGameState);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  if (!connected) return <>not connected</>;

  return (
    <SocketContext.Provider value={{ gameState }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContext;
