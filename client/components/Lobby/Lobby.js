"use client";
import { useContext } from "react";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import SocketContext from "@/contexts/SocketContext";
import { socket } from "@/utils/socket";
import styles from "./Lobby.module.scss";

export default function Lobby() {
  const { gameState } = useContext(SocketContext);
  const canStart = gameState.players.length > 1;

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
        {gameState.players.map(({ id, name, avatarUri }) => (
          <div key={id} className={styles.lobbyPlayer}>
            <img src={avatarUri} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
