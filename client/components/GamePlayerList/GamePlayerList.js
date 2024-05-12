"use client";
import { useContext } from "react";
import SocketContext from "@/contexts/SocketContext";
import styles from "./GamePlayerList.module.scss";

export default function GamePlayerList() {
  const { roomState, gameState } = useContext(SocketContext);
  const { usersById } = roomState;
  const { scoresByUserId } = gameState;
  const scoreOrderedUserIds = Object.keys(scoresByUserId).sort(
    (a, b) => scoresByUserId[b] - scoresByUserId[a]
  );

  return (
    <div className={styles.playerList}>
      {scoreOrderedUserIds.map((id) => (
        <div key={id} className={styles.player}>
          <img src={usersById[id].avatarUri} />
          <span className={styles.name}>{usersById[id].name}</span>
          <span>{scoresByUserId[id]}</span>
        </div>
      ))}
    </div>
  );
}
