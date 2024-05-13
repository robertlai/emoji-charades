import { io } from "./server.js";
import { rooms, isUserActive, getUser, transitionRoom } from "./rooms.js";
import { broadcastMessage } from "./messages.js";
import { getWord } from "./words.js";

const BASE_SCORE = 100;
const TIME_PER_TURN_S = 60;
const MAX_HINT_LENGTH = 28;

export let games = {};
let intervals = {};

function broadcastGameState(channelId) {
  io.to(channelId).emit("updateGameState", games[channelId]);
}

export function startGame(channelId) {
  games[channelId] = {
    turn: -1,
    turnUserIds: rooms[channelId].activeUserIds,
    scoresByUserId: rooms[channelId].activeUserIds.reduce(
      (acc, cur) => ({ ...acc, [cur]: 0 }),
      {}
    ),
  };
  nextTurn(channelId);
  transitionRoom(channelId, "game");
}

function nextTurn(channelId) {
  while (true) {
    games[channelId].turn++;

    // End game after last turn
    if (games[channelId].turn >= games[channelId].turnUserIds.length) {
      broadcastGameState(channelId);
      transitionRoom(channelId, "scoreboard");
      return;
    }

    // Found the next active user
    if (
      isUserActive(
        channelId,
        games[channelId].turnUserIds[games[channelId].turn]
      )
    ) {
      break;
    }
  }

  games[channelId].current = {
    hinter: games[channelId].turnUserIds[games[channelId].turn],
    word: getWord(),
    hint: [],
    guessedUserIds: [],
    timeRemaining: TIME_PER_TURN_S,
  };
  intervals[channelId] = setInterval(() => decrementTime(channelId), 1000);
  broadcastGameState(channelId);
}

function decrementTime(channelId) {
  if (--games[channelId].current.timeRemaining < 1) {
    endTurn(channelId);
  } else {
    broadcastGameState(channelId);
  }
}

function endTurn(channelId) {
  clearInterval(intervals[channelId]);
  broadcastMessage(
    channelId,
    null,
    `The word was ${games[channelId].current.word.toUpperCase()}`
  );
  nextTurn(channelId);
}

export function appendHint(channelId, emoji) {
  if (games[channelId].current.hint.length >= MAX_HINT_LENGTH) {
    console.log(`Max hint length reached in Channel (${channelId})!`);
    return;
  }
  games[channelId].current.hint.push(emoji);
  broadcastGameState(channelId);
}

export function checkGuess(channelId, userId, guess) {
  if (guess.toUpperCase() != games[channelId].current.word.toUpperCase()) {
    return false;
  }
  if (games[channelId].current.guessedUserIds.includes(userId)) {
    throw "already_guessed";
  }

  games[channelId].current.guessedUserIds.push(userId);
  const guessOrderMultiplier =
    rooms[channelId].activeUserIds.length -
    games[channelId].current.guessedUserIds.length;
  games[channelId].scoresByUserId[userId] += guessOrderMultiplier * BASE_SCORE;
  games[channelId].scoresByUserId[games[channelId].current.hinter] +=
    guessOrderMultiplier * BASE_SCORE;

  broadcastMessage(
    channelId,
    null,
    `${getUser(channelId, userId).name} guessed the word!`
  );

  const notGuessedUsers = rooms[channelId].activeUserIds.filter(
    (id) => !games[channelId].current.guessedUserIds.includes(id)
  );
  if (notGuessedUsers.length <= 1) {
    endTurn(channelId);
    return true;
  }

  broadcastGameState(channelId);
  return true;
}
