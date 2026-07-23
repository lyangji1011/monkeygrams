import { usernames } from "../data/usernames.js";

const rooms = new Map();
const DISCONNECT_GRACE_MS = 5000;

function getRandomLetter() {
	return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

export function createRoom() {
	let roomCode;
	do {
		roomCode = Array.from({ length: 6 }, () => getRandomLetter()).join("");
	} while (rooms.has(roomCode));

	rooms.set(roomCode, {
		players: new Map(),
	});
	return roomCode;
}

export function checkValidRoom(code) {
	return rooms.has(code);
}

export function getRoom(code) {
	return rooms.get(code);
}

export function getRoomPlayers(roomCode) {
	const room = rooms.get(roomCode);

	if (!room) {
		return [];
	}

	return Array.from(room.players.keys());
}

function getRandomUsername() {
	return usernames[Math.floor(Math.random() * usernames.length)];
}

function pickUsername(room) {
	let username;
	const takenUsernames = new Set(room.players.keys());

	do {
		username = getRandomUsername();
	} while (takenUsernames.has(username));

	return username;
}

export function joinRoom(roomCode, existingUsername, socketId) {
	const room = rooms.get(roomCode);

	if (!room) {
		return null;
	}

	const existingPlayer = existingUsername
		? room.players.get(existingUsername)
		: null;

	if (existingPlayer) {
		if (existingPlayer.disconnectTimer) {
			clearTimeout(existingPlayer.disconnectTimer);
			existingPlayer.disconnectTimer = null;
		}

		existingPlayer.socketId = socketId;

		return {
			username: existingUsername,
			players: getRoomPlayers(roomCode),
			isNew: false,
		};
	}

	const username =
		existingUsername && !room.players.has(existingUsername)
			? existingUsername
			: pickUsername(room);

	room.players.set(username, {
		socketId,
		disconnectTimer: null,
	});

	return {
		username,
		players: getRoomPlayers(roomCode),
		isNew: true,
	};
}

export function leaveRoomBySocketId(socketId) {
	for (const [roomCode, room] of rooms.entries()) {
		for (const [username, player] of room.players.entries()) {
			if (player.socketId !== socketId) {
				continue;
			}

			if (player.disconnectTimer) {
				clearTimeout(player.disconnectTimer);
			}

			player.disconnectTimer = setTimeout(() => {
				const currentRoom = rooms.get(roomCode);

				if (!currentRoom) {
					return;
				}

				const currentPlayer = currentRoom.players.get(username);

				if (!currentPlayer || currentPlayer.socketId !== socketId) {
					return;
				}

				currentRoom.players.delete(username);

				if (currentRoom.players.size === 0) {
					rooms.delete(roomCode);
				}
			}, DISCONNECT_GRACE_MS);

			return {
				roomCode,
				username,
			};
		}
	}

	return null;
}
