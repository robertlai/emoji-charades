"use client";
import Hero from "@/components/Hero";
import styles from "./Loading.module.scss";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className={styles.loading}>
      <Hero />
      <span>{message}</span>
    </div>
  );
}
