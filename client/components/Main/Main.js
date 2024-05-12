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

const VALID_STATES = ["lobby", "game", "scoreboard"];

export default function Main() {
  const { channelId, display, user } = useContext(AuthenticatedContext);
  const { roomState } = useContext(SocketContext);

  useEffect(() => {
    const { name, avatarUri } = display;
    socket.emit("createOrJoin", { channelId, name, avatarUri, id: user.id });
  }, []);

  if (!roomState) {
    return <Loading message="Joining room..." />;
  }
  if (!VALID_STATES.includes(roomState.flow)) {
    return <Loading message="Error: Unexpected game state." />;
  }

  return (
    <main className={styles.main}>
      <div className={styles.game}>
        {roomState.flow == "lobby" && <Lobby />}
        {roomState.flow == "game" && <Game />}
        {roomState.flow == "scoreboard" && <Scoreboard />}
      </div>
      <Chat />
    </main>
  );
}
