"use client";
import HeroGraphic from "@/components/HeroGraphic";
import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";
import styles from "./LobbyPage.module.scss";

export default function LobbyPage() {
  const { channelName } = useAuthenticatedContext();
  return (
    <main className={styles.main}>
      <HeroGraphic />
      <h1>Emoji Charades</h1>
      <span>{channelName}</span>
    </main>
  );
}
