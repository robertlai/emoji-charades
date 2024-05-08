import Emoji from "@/components/Emoji";
import styles from "./Medalist.module.scss";

export default function Medalist({ place, name, avatarUri, score }) {
  return (
    <div className={styles[`medal--${place}`]}>
      <span>{name}</span>
      <img className={styles.avatar} src={avatarUri} />
      <div className={styles.emoji}>
        <Emoji codePoint={`1f94${6 + place}`} />
      </div>
      <div>{score} pts</div>
    </div>
  );
}
