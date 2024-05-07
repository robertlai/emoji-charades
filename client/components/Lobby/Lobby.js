"use client";
import { useContext } from "react";
import HeroGraphic from "@/components/HeroGraphic";
import SocketContext from "@/contexts/SocketContext";
import styles from "./Lobby.module.scss";

export default function Lobby() {
  const { gameState } = useContext(SocketContext);

  console.log(gameState);

  if (!gameState) return <>no</>;

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <HeroGraphic />
        <h1>Emoji Charades</h1>
      </div>
      <span>{JSON.stringify(gameState)}</span>
      <div className={styles.players}>
        {gameState.players.map(({ id, name, avatarUri }) => (
          <div key={id} className={styles.lobbyPlayer}>
            <img src={avatarUri} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
