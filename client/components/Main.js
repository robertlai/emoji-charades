"use client";
import { useContext, useEffect } from "react";
import Loading from "@/components/Loading";
import Lobby from "@/components/Lobby";
import AuthenticatedContext from "@/contexts/AuthenticatedContext";
import SocketContext from "@/contexts/SocketContext";
import { socket } from "@/utils/socket";

export default function Main() {
  const { channelId, display, user } = useContext(AuthenticatedContext);
  const { gameState } = useContext(SocketContext);

  useEffect(() => {
    const { name, avatarUri } = display;
    socket.emit("createOrJoin", { channelId, name, avatarUri, id: user.id });
  }, []);

  if (!gameState) return <Loading message="Joining room..." />;
  if (gameState.flow == "lobby") return <Lobby />;
  return <Loading message="Error: Unexpected game state." />;
}