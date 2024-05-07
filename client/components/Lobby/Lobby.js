"use client";
import { useContext } from "react";
import Chat from "@/components/Chat";
import HeroGraphic from "@/components/HeroGraphic";
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
    <main className={styles.main}>
      <div className={styles.lobby}>
        <div className={styles.hero}>
          <HeroGraphic />
          <h1>Emoji Charades</h1>
          <button
            className={!canStart && styles.disabled}
            disabled={!canStart}
            onClick={startGame}
          >
            Start
          </button>
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
      <Chat />
    </main>
  );
}
