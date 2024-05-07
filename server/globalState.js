import { getWord } from "./words.js";

const MAX_HINT_LENGTH = 28;

export let globalState = {
  rooms: {},
};

function createRoom(roomId) {
  globalState.rooms[roomId] = {
    flow: "lobby",
    players: [],
    playerConnections: {},
    playerScores: {},
  };
}

export function addUserToRoom(user, roomId) {
  // Create room if it doesn't exist
  if (!globalState.rooms[roomId]) createRoom(roomId);

  // Add user if not already in room; increment connection
  if (!globalState.rooms[roomId].playerConnections[user.id]) {
    globalState.rooms[roomId].players.push(user);
    globalState.rooms[roomId].playerConnections[user.id] = 1;
    globalState.rooms[roomId].playerScores[user.id] = 0;
  } else {
    globalState.rooms[roomId].playerConnections[user.id] += 1;
  }
}

export function removeUserFromRoom(userId, roomId) {
  // Decrement connection if user connected
  if (globalState.rooms[roomId].playerConnections[userId]) {
    globalState.rooms[roomId].playerConnections[userId] -= 1;
  }

  // Remove user from room if no more connections
  if (globalState.rooms[roomId].playerConnections[userId] < 1) {
    globalState.rooms[roomId].players = globalState.rooms[
      roomId
    ].players.filter((p) => p.id !== userId);
  }

  // Delete room if no more players
  if (globalState.rooms[roomId].players.length === 0) {
    delete globalState.rooms[roomId];
  }
}

export function startGame(roomId) {
  if (globalState.rooms[roomId].flow != "lobby") {
    console.log(`Game is not in lobby in Channel (${roomId})!`);
    return;
  }
  globalState.rooms[roomId].flow = "playing";
  globalState.rooms[roomId].turn = 0;
  globalState.rooms[roomId].currentWord = getWord();
  globalState.rooms[roomId].hint = [];
}

export function appendHint(roomId, emoji) {
  if (globalState.rooms[roomId].flow != "playing") {
    console.log(`Game is not playing in Channel (${roomId})!`);
    return;
  }
  if (globalState.rooms[roomId].hint.length === MAX_HINT_LENGTH) {
    console.log(`Max hint length reached in Channel (${roomId})!`);
    return;
  }
  globalState.rooms[roomId].hint.push(emoji);
}
