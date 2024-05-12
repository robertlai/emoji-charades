"use client";
import { useContext } from "react";
import Button from "@/components/Button";
import Medalist from "@/components/Medalist";
import SocketContext from "@/contexts/SocketContext";
import { socket } from "@/utils/socket";
import styles from "./Scoreboard.module.scss";

export default function Scoreboard() {
  const { gameState } = useContext(SocketContext);
  const { players, playerScores } = gameState;

  function onClickReturn() {
    socket.emit("returnToLobby");
  }

  const scoreboard = players
    .map(({ id, name, avatarUri }) => ({
      id,
      name,
      avatarUri,
      score: playerScores[id],
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className={styles.scoreboard}>
      <div className={styles.medalists}>
        {scoreboard.slice(0, 3).map(({ id, name, avatarUri, score }, i) => (
          <Medalist
            key={id}
            place={i + 1}
            name={name}
            avatarUri={avatarUri}
            score={score}
          />
        ))}
      </div>
      {scoreboard.length > 3 && (
        <div className={styles.losers}>
          {scoreboard.slice(3).map(({ id, name, score }, i) => (
            <div key={id} className={styles.loser}>
              <span className={styles.place}>{i + 4}</span>
              <span className={styles.name}>{name}</span>
              <span>{score} pts</span>
            </div>
          ))}
        </div>
      )}
      <Button onClick={onClickReturn}>Return to lobby</Button>
    </div>
  );
}
