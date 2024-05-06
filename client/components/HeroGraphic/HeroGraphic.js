"use client";
import { useEffect, useState } from "react";
import Twemoji from "@/components/Twemoji";
import emojis from "@/utils/emojis";
import styles from "./HeroGraphic.module.scss";

export default function HeroGraphic() {
  const [emoji, setEmoji] = useState("😊");

  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: Prevent same emoji appearing consecutively
      setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <Twemoji emoji={emoji} />
      <div className={styles.border} />
    </div>
  );
}
