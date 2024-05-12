"use client";
import { useContext } from "react";
import Button from "@/components/Button";
import Medalist from "@/components/Medalist";
import SocketContext from "@/contexts/SocketContext";
import { socket } from "@/utils/socket";
import styles from "./Scoreboard.module.scss";

export default function Scoreboard() {
  const { roomState, gameState } = useContext(SocketContext);
  const { usersById } = roomState;
  const { scoresByUserId } = gameState;
  const scoreOrderedUserIds = Object.keys(scoresByUserId).sort(
    (a, b) => scoresByUserId[b] - scoresByUserId[a]
  );

  function onClickReturn() {
    socket.emit("returnToLobby");
  }

  return (
    <div className={styles.scoreboard}>
      <div className={styles.medalists}>
        {scoreOrderedUserIds.slice(0, 3).map((id, i) => (
          <Medalist
            key={id}
            place={i + 1}
            name={usersById[id].name}
            avatarUri={usersById[id].avatarUri}
            score={scoresByUserId[id]}
          />
        ))}
      </div>
      {scoreOrderedUserIds.length > 3 && (
        <div className={styles.losers}>
          {scoreOrderedUserIds.slice(3).map((id, i) => (
            <div key={id} className={styles.loser}>
              <span className={styles.place}>{i + 4}</span>
              <span className={styles.name}>{usersById[id].name}</span>
              <span>{scoresByUserId[id]} pts</span>
            </div>
          ))}
        </div>
      )}
      <Button onClick={onClickReturn}>Return to lobby</Button>
    </div>
  );
}
