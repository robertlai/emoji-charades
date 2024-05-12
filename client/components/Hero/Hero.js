"use client";
import { useEffect, useState } from "react";
import Emoji from "@/components/Emoji";
import { emojiCodePoints } from "@/utils/emojis";
import styles from "./Hero.module.scss";

export default function Hero() {
  const [emoji, setEmoji] = useState("1f60a"); // 😊

  useEffect(() => {
    const interval = setInterval(() => {
      let nextEmoji = emoji;
      while (emoji === nextEmoji) {
        nextEmoji =
          emojiCodePoints[Math.floor(Math.random() * emojiCodePoints.length)];
      }
      setEmoji(nextEmoji);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.hero}>
      <div className={styles.graphic}>
        <Emoji codePoint={emoji} />
        <div className={styles.border} />
      </div>
      <h1>Emoji Charades</h1>
    </div>
  );
}
