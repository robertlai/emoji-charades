"use client";
import { useContext } from "react";
import SocketContext from "@/contexts/SocketContext";
import styles from "./Countdown.module.scss";

export default function Countdown() {
  const { gameState } = useContext(SocketContext);

  return (
    <div className={styles.container}>
      {gameState.timeRemaining}
      <div className={styles.border} />
    </div>
  );
}
