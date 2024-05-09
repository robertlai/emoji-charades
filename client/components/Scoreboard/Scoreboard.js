"use client";
import { useContext } from "react";
import Chat from "@/components/Chat";
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

  let scoreboard = players
    .map(({ id, name, avatarUri }) => ({
      id,
      name,
      avatarUri,
      score: playerScores[id],
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <main className={styles.scoreboard}>
      <div className={styles.main}>
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
                <div className={styles.place}>{i + 4}</div>
                <div className={styles.name}>{name}</div>
                <span>{score} pts</span>
              </div>
            ))}
          </div>
        )}
        <button onClick={onClickReturn}>Return to lobby</button>
      </div>

      <Chat />
    </main>
  );
}
