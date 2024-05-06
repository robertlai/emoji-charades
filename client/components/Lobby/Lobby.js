"use client";
import HeroGraphic from "@/components/HeroGraphic";
import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";
import styles from "./Lobby.module.scss";

export default function Lobby() {
  const { channelName, guildImg } = useAuthenticatedContext();
  return (
    <main className={styles.main}>
      <HeroGraphic />
      <h1>Emoji Charades</h1>
      <span>{channelName}</span>
      <img width={128} height={128} src={guildImg} draggable={false} />
    </main>
  );
}
