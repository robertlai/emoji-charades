import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  globalState,
  addUserToRoom,
  removeUserFromRoom,
  startGame,
} from "./globalState.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { pingInterval: 10000 });

function updateGameState(channelId) {
  io.to(channelId).emit("updateGameState", globalState.rooms[channelId]);
}

io.on("connection", (socket) => {
  let localState = {};

  socket.on("createOrJoin", ({ channelId, name, avatarUri, id }) => {
    try {
      localState = { id, channelId };
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
