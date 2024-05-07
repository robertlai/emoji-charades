"use client";
import { useContext, useRef } from "react";
import AuthenticatedContext from "@/contexts/AuthenticatedContext";
import SocketContext from "@/contexts/SocketContext";
import { socket } from "@/utils/socket";
import styles from "./Chat.module.scss";

export default function Chat() {
  const inputRef = useRef(null);
  const { user } = useContext(AuthenticatedContext);
  const { gameState, messages } = useContext(SocketContext);

  function onSubmit(e) {
    e.preventDefault();
    if (!inputRef.current?.value?.trim() || isHinter) return;
    socket.emit("guess", { guess: inputRef.current.value.trim() });
    inputRef.current.value = "";
  }

  const usersById = gameState.players.reduce(
    (acc, cur) => ({ ...acc, [cur.id]: cur }),
    {}
  );

  let isHinter = false;
  let placeholder = "Type a message...";
  if (gameState.flow == "playing") {
    isHinter = gameState.players[gameState.turn].id == user.id;
    if (isHinter) {
      placeholder = "Type your guess...";
    }
  }

  return (
    <div className={styles.chat}>
      <div className={styles.messages}>
        {messages.map(({ from, text, ts }) => (
          <div className={styles.message} key={`${from}_${ts}`}>
            {usersById[from] && (
              <div className={styles.user}>
                <img src={usersById[from].avatarUri} />
                <span>{usersById[from].name}</span>
              </div>
            )}
            <div className={`${styles.text} ${!from && styles.system}`}>
              {text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          placeholder={placeholder}
          disabled={isHinter}
          autoFocus={!isHinter}
          maxLength={200}
        />
      </form>
    </div>
  );
}
