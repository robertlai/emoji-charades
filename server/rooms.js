import { io } from "./server.js";

const VALID_TRANSITIONS = {
  lobby: ["game"],
  game: ["scoreboard"],
  scoreboard: ["lobby"],
};

export let rooms = {};

function broadcastRoomState(channelId) {
  io.to(channelId).emit("updateRoomState", rooms[channelId]);
}

export function createOrJoinRoom(channelId, user) {
  // Create room if it doesn't exist
  if (!rooms[channelId]) {
    rooms[channelId] = {
      flow: "lobby",
      activeUserIds: [],
      usersById: {},
    };
  }

  // Add user if not already in room
  if (!rooms[channelId].activeUserIds.includes(user.id)) {
    rooms[channelId].activeUserIds.push(user.id);
    rooms[channelId].usersById[user.id] = {
      ...user,
      connections: 0,
    };
  }

  // Increment user connections
  rooms[channelId].usersById[user.id].connections++;

  broadcastRoomState(channelId);
}

export function leaveRoom(channelId, userId) {
  // Decrement user connections
  rooms[channelId].usersById[userId].connections--;

  // Remove user if no more connections
  if (rooms[channelId].usersById[userId].connections < 1) {
    rooms[channelId].activeUserIds = rooms[channelId].activeUserIds.filter(
      (id) => id != userId
    );
  }

  // Delete room if no more users
  if (rooms[channelId].activeUserIds.length === 0) {
    delete rooms[channelId];
  }

  broadcastRoomState(channelId);
}

export function isUserActive(channelId, userId) {
  return rooms[channelId].activeUserIds.includes(userId);
}

export function getUser(channelId, userId) {
  return rooms[channelId].usersById[userId];
}

export function isFlow(channelId, flow) {
  return rooms[channelId].flow == flow;
}

export function transitionRoom(channelId, flow) {
  if (!VALID_TRANSITIONS[rooms[channelId].flow].includes(flow)) {
    throw `Room (${channelId}) cannot transition from ${rooms[channelId].flow} to ${flow}!`;
  }
  rooms[channelId].flow = flow;
  broadcastRoomState(channelId);
}
