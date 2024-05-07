export let globalState = {
  rooms: {},
};

function createRoom(roomId) {
  globalState.rooms[roomId] = {
    flow: "lobby",
    players: [],
    playerConnections: {},
  };
}

export function addUserToRoom(user, roomId) {
  if (!globalState.rooms[roomId]) createRoom(roomId);
  if (!globalState.rooms[roomId].playerConnections[user.id]) {
    globalState.rooms[roomId].players.push(user);
    globalState.rooms[roomId].playerConnections[user.id] = 1;
  } else {
    globalState.rooms[roomId].playerConnections[user.id] += 1;
  }
}

export function removeUserFromRoom(userId, roomId) {
  if (globalState.rooms[roomId].playerConnections[userId]) {
    globalState.rooms[roomId].playerConnections[userId] -= 1;
  }
  if (globalState.rooms[roomId].playerConnections[userId] < 1) {
    globalState.rooms[roomId].players = globalState.rooms[
      roomId
    ].players.filter((p) => p.id !== userId);
  }
}
