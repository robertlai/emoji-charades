"use client";
import { createContext, useEffect, useState } from "react";
import Loading from "@/components/Loading";
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
      socket.off("updateGameState", onUpdateGameState);
    };
  }, []);

  if (!connected) return <Loading message="Connecting to server..." />;

  return (
    <SocketContext.Provider value={{ gameState }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContext;
