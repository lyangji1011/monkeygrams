import { usernames } from "../data/usernames.js";
import { ServerPlayer, Username } from "../types/player.js";
import { Room, RoomCode, RoomState, SocketId } from "../types/room.js";
import { Tile } from "../../../shared/types/tile.js";

const rooms = new Map<RoomCode, Room>();
const socketRooms = new Map<SocketId, RoomCode>();
const DISCONNECT_GRACE_MS = 5000;

function getRandomLetter() {
	return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

export function getPlayerFromSocketId(roomCode: RoomCode, socketId: SocketId) {
	const room = rooms.get(roomCode);
	if (!room) return null;

	const player = room.players.get(socketId);
	if (!player) return null;

	return player;
}

export function createRoom() {
	let roomCode;
	do {
		roomCode = Array.from({ length: 6 }, () => getRandomLetter()).join("");
	} while (rooms.has(roomCode));

	rooms.set(roomCode, {
		players: new Map(),
		state: RoomState.LOBBY,
		gameState: {
			bag: [],
			hands: new Map<string, Tile[]>(),
		},
	});
	return roomCode;
}

export function tryJoinRoom(
	roomCode: string,
	socketId: string,
	username: Username | null,
) {
	if (!checkValidRoom(roomCode)) {
		return { ok: false as const, error: "room not found" as const };
	}

	if (roomIsFull(roomCode)) {
		return { ok: false as const, error: "room is full" as const };
	}

	const joinedRoom = joinRoom(roomCode, socketId, username);

	if (!joinedRoom) {
		return { ok: false as const, error: "room not found" as const };
	}

	return {
		ok: true as const,
		roomCode,
		joinedRoom,
	};
}

export function setPlayerReady(
	roomCode: string,
	socketId: string,
	ready: boolean,
) {
	const player = getPlayerFromSocketId(roomCode, socketId);
	if (!player) return null;
	player.isReady = ready;

	return {
		roomCode,
		players: getRoomPlayers(roomCode),
	};
}

export function checkValidRoom(code: string) {
	return rooms.has(code);
}

export function roomIsFull(code: string) {
	return rooms.get(code)?.players.size === 8;
}

export function getRoom(code: string) {
	return rooms.get(code);
}

export function getRoomPlayers(roomCode: string) {
	const room = rooms.get(roomCode);

	if (!room) {
		return [];
	}

	return Array.from(room.players.values()).map((player) => ({
		username: player.username,
		isReady: player.isReady,
	}));
}

function getRandomUsername() {
	return `Anonymous ${usernames[Math.floor(Math.random() * usernames.length)]}`;
}

function pickUsername(room: Room) {
	let username;
	const takenUsernames = new Set(
		Array.from(room.players.values()).map(
			(player: ServerPlayer) => player.username,
		),
	);

	do {
		username = getRandomUsername();
	} while (takenUsernames.has(username));

	return username;
}

export function joinRoom(
	roomCode: string,
	socketId: SocketId,
	existingUsername: Username | null,
) {
	const room = rooms.get(roomCode);

	if (!room) {
		return null;
	}

	const existingPlayer = existingUsername
		? Array.from(room.players.entries()).find(
				([_, player]) => player.username === existingUsername,
			)
		: null;

	if (existingPlayer) {
		const [oldSocketId, player] = existingPlayer;

		if (player.disconnectTimer) {
			clearTimeout(player.disconnectTimer);
			player.disconnectTimer = null;
		}

		room.players.delete(oldSocketId);

		room.players.set(socketId, player);

		socketRooms.delete(oldSocketId);
		socketRooms.set(socketId, roomCode);

		return {
			username: player.username,
			players: getRoomPlayers(roomCode),
			isNew: false,
		};
	}

	const username =
		existingUsername &&
		!Array.from(room.players.values()).some(
			(player) => player.username === existingUsername,
		)
			? existingUsername
			: pickUsername(room);

	room.players.set(socketId, {
		username,
		isReady: false,
		disconnectTimer: null,
	});

	socketRooms.set(socketId, roomCode);

	return {
		username,
		players: getRoomPlayers(roomCode),
		isNew: true,
	};
}

export function leaveRoomBySocketId(socketId: string) {
	const roomCode = socketRooms.get(socketId);
	if (!roomCode) return null;

	const room = rooms.get(roomCode);
	if (!room) return null;

	const player = room.players.get(socketId);
	if (!player) return null;

	if (player.disconnectTimer) {
		clearTimeout(player.disconnectTimer);
	}

	player.disconnectTimer = setTimeout(() => {
		const currentPlayer = room.players.get(socketId);
		if (!currentPlayer) return;

		room.players.delete(socketId);
		socketRooms.delete(socketId);

		if (room.players.size === 0) {
			rooms.delete(roomCode);
		}
	}, DISCONNECT_GRACE_MS);

	return {
		roomCode,
		username: player.username,
	};
}
