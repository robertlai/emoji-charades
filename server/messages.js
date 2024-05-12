import { io } from "./server.js";

export function broadcastMessage(channelId, from, text) {
  io.to(channelId).emit("message", { from, text, ts: Date.now() });
}

export function whisperMessage(socket, from, text) {
  socket.emit("message", { from, text, ts: Date.now() });
}
