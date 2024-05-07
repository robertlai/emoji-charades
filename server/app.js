import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  globalState,
  addUserToRoom,
  removeUserFromRoom,
} from "./globalState.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  console.log("Connected");

  let localState = {};

  socket.on("createOrJoin", ({ channelId, name, avatarUri, id }) => {
    localState = { id, channelId };
    console.log(`User (${id}) joined in Channel (${channelId})`);

    addUserToRoom({ id, name, avatarUri }, channelId);

    socket.join(channelId);
    io.to(channelId).emit("updateGameState", globalState.rooms[channelId]);
  });

  socket.on("disconnect", () => {
    const { id, channelId } = localState;
    console.log(`User (${id}) left in Channel (${channelId})`);

    removeUserFromRoom(id, channelId);

    io.to(channelId).emit("updateGameState", globalState.rooms[channelId]);
    socket.leave(channelId);
  });
});

httpServer.listen(3001);
