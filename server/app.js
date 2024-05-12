import { httpServer, io } from "./server.js";
import {
  createOrJoinRoom,
  leaveRoom,
  isFlow,
  transitionRoom,
} from "./rooms.js";
import { startGame, appendHint, checkGuess } from "./games.js";
import { broadcastMessage, whisperMessage } from "./messages.js";

io.on("connection", (socket) => {
  let user = {};

  socket.on("createOrJoin", ({ channelId, name, avatarUri, id }) => {
    try {
      user = { avatarUri, channelId, id, name };
      console.log(`User (${id}) joined Channel (${channelId})`);

      socket.join(channelId);
      createOrJoinRoom(channelId, user);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  });

  socket.on("disconnect", () => {
    try {
      const { id, channelId } = user;
      console.log(`User (${id}) left Channel (${channelId})`);

      leaveRoom(channelId, id);
      socket.leave(channelId);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  });

  socket.on("startGame", () => {
    try {
      const { channelId } = user;
      console.log(`Starting game in Channel (${channelId})`);

      startGame(channelId);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  });

  socket.on("appendHint", ({ emoji }) => {
    try {
      const { channelId } = user;
      appendHint(channelId, emoji);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  });

  socket.on("message", ({ message }) => {
    try {
      const { id, channelId } = user;
      if (isFlow(channelId, "game") && checkGuess(channelId, id, message)) {
        return;
      }
      broadcastMessage(channelId, id, message);
    } catch (e) {
      if (e == "already_guessed") {
        whisperMessage(socket, null, "You already guessed the word!");
        return;
      }
      console.log(`Error: ${e}`);
    }
  });

  socket.on("returnToLobby", () => {
    const { channelId } = user;
    transitionRoom(channelId, "lobby");
  });
});

httpServer.listen(3001);
