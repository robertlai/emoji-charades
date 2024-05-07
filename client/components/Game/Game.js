"use client";
import { useContext, useState } from "react";
import AuthenticatedContext from "@/contexts/AuthenticatedContext";
import Emoji from "@/components/Emoji";
import SocketContext from "@/contexts/SocketContext";
import { emojiCodePoints, emojiStrategy } from "@/utils/emojis";
import styles from "./Game.module.scss";

const MAX_RESULTS = 95;

export default function Game() {
  const [query, setQuery] = useState("");
  const { user } = useContext(AuthenticatedContext);
  const { gameState } = useContext(SocketContext);

  function onChange(e) {
    setQuery(e.target.value);
  }

  const isHinter = gameState.players[gameState.turn].id == user.id;

  let emojiResults = [];
  if (isHinter) {
    let results = [];
    let results2 = [];
    let results3 = [];
    Object.keys(emojiStrategy).forEach((key) => {
      const { shortname_alternates, keywords, shortname } = emojiStrategy[key];
      if (shortname.indexOf(query) > -1) {
        results.push(key);
      } else {
        if (shortname_alternates && shortname_alternates.indexOf(query) > -1) {
          results2.push(key);
        } else if (keywords && keywords.indexOf(query) > -1) {
          results3.push(key);
        }
      }
    });
    if (query.length >= 3) {
      results.sort(function (a, b) {
        return a.length > b.length;
      });
      results2.sort(function (a, b) {
        return a.length > b.length;
      });
      results3.sort();
    }
    emojiResults = results
      .concat(results2)
      .concat(results3)
      .filter((r) => emojiCodePoints.indexOf(r) > -1)
      .slice(0, MAX_RESULTS);
  }

  return (
    <div className={styles.game}>
      <div className={styles.playerList}>
        {gameState.players.map(({ id, name, avatarUri }) => (
          <div key={id} className={styles.player}>
            <img src={avatarUri} />
            <span className={styles.name}>{name}</span>
            <span>{gameState.playerScores[id]}</span>
          </div>
        ))}
      </div>
      <div className={styles.main}>
        {isHinter ? (
          <>
            <div>
              Your word is{" "}
              <span className={styles.word}>
                {gameState.currentWord.toUpperCase()}
              </span>
            </div>
            <div className={styles.hint}></div>
            <div className={styles.input}>
              <input
                onChange={onChange}
                placeholder="Search for an emoji..."
              ></input>
              <div className={styles.results}>
                {emojiResults.map((cp) => (
                  <Emoji key={cp} codePoint={cp} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>guesser</>
        )}
      </div>
      <div className={styles.chat}></div>
    </div>
  );
}
