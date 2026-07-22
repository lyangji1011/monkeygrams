import { usernames } from "../data/usernames.js";

const rooms = new Map();

function getRandomLetter() {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

export function createRoom() {
  let roomCode;
  do {
    roomCode = Array.from({ length: 6 }, () => getRandomLetter()).join("");
  } while (rooms.has(roomCode));

  rooms.set(roomCode, {
    users: new Set(),
  });
  return roomCode;
}

export function checkValidRoom(code) {
  return rooms.has(code);
}

export function getRoom(code) {
  return rooms.get(code);
}

function getRandomUsername() {
  return usernames[Math.floor(Math.random() * usernames.length)];
}

export function getUsername(roomCode) {
  let username;
  const takenUsernames = rooms.get(roomCode).users;

  do {
    username = getRandomUsername();
  } while (takenUsernames.has(username));

  rooms.get(roomCode).users.add(username);
  return username;
}