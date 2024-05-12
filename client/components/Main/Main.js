"use client";
import { useContext, useEffect } from "react";
import Chat from "@/components/Chat";
import Game from "@/components/Game";
import Loading from "@/components/Loading";
import Lobby from "@/components/Lobby";
import Scoreboard from "@/components/Scoreboard";
import AuthenticatedContext from "@/contexts/AuthenticatedContext";
import SocketContext from "@/contexts/SocketContext";
import { socket } from "@/utils/socket";
import styles from "./Main.module.scss";

const VALID_STATES = ["lobby", "playing", "scoreboard"];

export default function Main() {
  const { channelId, display, user } = useContext(AuthenticatedContext);
  const { gameState } = useContext(SocketContext);

  useEffect(() => {
    const { name, avatarUri } = display;
    socket.emit("createOrJoin", { channelId, name, avatarUri, id: user.id });
  }, []);

  if (!gameState) {
    return <Loading message="Joining room..." />;
  }
  if (!VALID_STATES.includes(gameState.flow)) {
    return <Loading message="Error: Unexpected game state." />;
  }

  return (
    <main className={styles.main}>
      <div className={styles.game}>
        {gameState.flow == "lobby" && <Lobby />}
        {gameState.flow == "playing" && <Game />}
        {gameState.flow == "scoreboard" && <Scoreboard />}
      </div>
      <Chat />
    </main>
  );
}
