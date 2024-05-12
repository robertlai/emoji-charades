"use client";
import { useContext } from "react";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import SocketContext from "@/contexts/SocketContext";
import { socket } from "@/utils/socket";
import styles from "./Lobby.module.scss";

export default function Lobby() {
  const { roomState } = useContext(SocketContext);
  const { activeUserIds, usersById } = roomState;
  const canStart = activeUserIds.length > 1;

  function startGame() {
    socket.emit("startGame");
  }

  return (
    <div className={styles.lobby}>
      <div className={styles.top}>
        <Hero />
        <Button disabled={!canStart} onClick={startGame}>
          Start
        </Button>
      </div>
      <div className={styles.players}>
        {activeUserIds.map((id) => (
          <div key={id} className={styles.lobbyPlayer}>
            <img src={usersById[id].avatarUri} />
            <span>{usersById[id].name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
