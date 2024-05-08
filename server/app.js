import { app, httpServer, io } from "./io.js";
import {
  globalState,
  addUserToRoom,
  removeUserFromRoom,
  startGame,
  appendHint,
  checkGuess,
} from "./globalState.js";

function updateGameState(channelId) {
  io.to(channelId).emit("updateGameState", globalState.rooms[channelId]);
}

function gameMessage(channelId, from, text) {
  io.to(channelId).emit("message", { from, text, ts: Date.now() });
}

io.on("connection", (socket) => {
  let localState = {};

  socket.on("createOrJoin", ({ channelId, name, avatarUri, id }) => {
    try {
      localState = { id, channelId, name };
      console.log(`User (${id}) joined in Channel (${channelId})`);

      addUserToRoom({ id, name, avatarUri }, channelId);
      socket.join(channelId);
      updateGameState(channelId);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  });

  socket.on("startGame", () => {
    const { channelId } = localState;
    console.log(`Starting game in Channel (${channelId})`);

    startGame(channelId);
    updateGameState(channelId);
  });

  socket.on("appendHint", ({ emoji }) => {
    const { channelId } = localState;
    appendHint(channelId, emoji);
    updateGameState(channelId);
  });

  socket.on("guess", ({ guess }) => {
    const { id, channelId, name } = localState;
    try {
      const isMatch = checkGuess(channelId, id, guess);
      if (isMatch) {
        gameMessage(channelId, null, `${name} guessed the word!`);
        updateGameState(channelId);
      } else {
        gameMessage(channelId, id, guess);
      }
    } catch (e) {
      socket.emit("message", {
        text: "You already guessed the word!",
        ts: Date.now(),
      });
    }
  });

  socket.on("returnToLobby", () => {
    const { channelId } = localState;
    globalState.rooms[channelId].flow = "lobby";
    socket.emit("updateGameState", globalState.rooms[channelId]);
  });

  socket.on("disconnect", () => {
    try {
      const { id, channelId } = localState;
      console.log(`User (${id}) left in Channel (${channelId})`);

      removeUserFromRoom(id, channelId);
      updateGameState(channelId);
      socket.leave(channelId);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  });
});

httpServer.listen(3001);
