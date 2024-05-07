"use client";
import HeroGraphic from "@/components/HeroGraphic";
import styles from "./Loading.module.scss";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className={styles.loading}>
      <HeroGraphic />
      <h1>Emoji Charades</h1>
      <span>{message}</span>
    </div>
  );
}
