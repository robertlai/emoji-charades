import { io } from "./io.js";
import { getWord } from "./words.js";

// TOOD: fix spaghetti code

const MAX_HINT_LENGTH = 28;

export let globalState = {
  rooms: {},
  timers: {},
};

function decrementTime(roomId) {
  globalState.rooms[roomId].timeRemaining -= 1;
  if (globalState.rooms[roomId].timeRemaining === 0) {
    clearInterval(globalState.timers[roomId]);
    globalState.rooms[roomId].turn += 1;
    io.to(roomId).emit("message", {
      text: `The word was ${globalState.rooms[roomId].currentWord}`,
      ts: Date.now(),
    });
    if (
      globalState.rooms[roomId].turn >= globalState.rooms[roomId].players.length
    ) {
      globalState.rooms[roomId].flow = "scoreboard";
    } else {
      startTurn(roomId);
    }
  }

  io.to(roomId).emit("updateGameState", globalState.rooms[roomId]);
}

function createRoom(roomId) {
  globalState.rooms[roomId] = {
    flow: "lobby",
    players: [],
    playerConnections: {},
    playerScores: {},
  };
}

function startTurn(roomId) {
  globalState.rooms[roomId].currentWord = getWord();
  globalState.rooms[roomId].hint = [];
  globalState.rooms[roomId].playersGuessed = [];
  globalState.rooms[roomId].timeRemaining = 60;
  globalState.timers[roomId] = setInterval(() => decrementTime(roomId), 1000);
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
  // TODO: Fix case of user leaving during game
  globalState.rooms[roomId].turn = 0;
  globalState.rooms[roomId].playerScores = globalState.rooms[
    roomId
  ].players.reduce((acc, cur) => ({ ...acc, [cur.id]: 0 }), {});
  startTurn(roomId);
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

export function checkGuess(roomId, userId, guess) {
  if (globalState.rooms[roomId].flow != "playing") {
    console.log(`Game is not playing in Channel (${roomId})!`);
    return false;
  }
  if (guess.toLowerCase() == globalState.rooms[roomId].currentWord) {
    if (globalState.rooms[roomId].playersGuessed.includes(userId)) {
      console.log(`User (${userId}) already guessed in Channel (${roomId})!`);
      throw "Already guessed";
    }
    globalState.rooms[roomId].playerScores[userId] +=
      (globalState.rooms[roomId].players.length -
        globalState.rooms[roomId].playersGuessed.length -
        1) *
      100;
    globalState.rooms[roomId].playersGuessed.push(userId);
    if (
      globalState.rooms[roomId].playersGuessed.length >=
      globalState.rooms[roomId].players.length - 2
    ) {
      clearInterval(globalState.timers[roomId]);
      globalState.rooms[roomId].turn += 1;
      io.to(roomId).emit("message", {
        text: `The word was ${globalState.rooms[roomId].currentWord}`,
        ts: Date.now(),
      });
      if (
        globalState.rooms[roomId].turn >=
        globalState.rooms[roomId].players.length
      ) {
        globalState.rooms[roomId].flow = "scoreboard";
      } else {
        startTurn(roomId);
      }
    }
    return true;
  }
  return false;
}
