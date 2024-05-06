import { memo } from "react";
import twemoji from "twemoji";
import styles from "./Emoji.module.scss";

const Twemoji = ({ codePoint }) => (
  <img
    className={styles.emoji}
    draggable={false}
    alt={twemoji.convert.fromCodePoint(codePoint)}
    src={`/emojis/${codePoint}.svg`}
  />
);

export default memo(Twemoji);
