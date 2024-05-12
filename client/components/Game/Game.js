"use client";
import { useContext } from "react";
import Countdown from "@/components/Countdown";
import EmojiPicker from "@/components/EmojiPicker";
import GamePlayerList from "@/components/GamePlayerList";
import Hint from "@/components/Hint";
import AuthenticatedContext from "@/contexts/AuthenticatedContext";
import SocketContext from "@/contexts/SocketContext";
import styles from "./Game.module.scss";

export default function Game() {
  const { user } = useContext(AuthenticatedContext);
  const { gameState } = useContext(SocketContext);

  const isHinter = gameState.players[gameState.turn].id == user.id;

  return (
    <div className={styles.game}>
      <GamePlayerList />
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.text}>
            {isHinter ? (
              <>
                Your word is{" "}
                <span className={styles.word}>
                  {gameState.currentWord.toUpperCase()}
                </span>
              </>
            ) : (
              gameState.currentWord.split("").map((c) => " _ ")
            )}
          </div>
          <Countdown />
        </div>

        <Hint />

        {isHinter && <EmojiPicker />}
      </div>
    </div>
  );
}
