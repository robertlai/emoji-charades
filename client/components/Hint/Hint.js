"use client";
import { useContext } from "react";
import Emoji from "@/components/Emoji";
import SocketContext from "@/contexts/SocketContext";
import styles from "./Hint.module.scss";

export default function Hint() {
  const { gameState } = useContext(SocketContext);
  return (
    <div className={styles.hint}>
      {gameState.hint.map((cp) => (
        <Emoji key={cp} codePoint={cp} />
      ))}
    </div>
  );
}
