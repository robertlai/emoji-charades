"use client";
import { useContext } from "react";
import SocketContext from "@/contexts/SocketContext";
import styles from "./GamePlayerList.module.scss";

export default function GamePlayerList() {
  const { gameState } = useContext(SocketContext);
  const { players, playerScores } = gameState;

  return (
    <div className={styles.playerList}>
      {players.map(({ id, name, avatarUri }) => (
        <div key={id} className={styles.player}>
          <img src={avatarUri} />
          <span className={styles.name}>{name}</span>
          <span>{playerScores[id]}</span>
        </div>
      ))}
    </div>
  );
}
