import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import {
	checkValidRoom,
	getRoomPlayers,
	leaveRoomBySocketId,
	setPlayerReady,
	tryJoinRoom,
	getRoom,
} from "./routes/rooms.js";
import { dumpTile, startGame, peel } from "./routes/game.js";

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	socket.on("join-room", ({ roomCode, username }) => {
		const result = tryJoinRoom(roomCode, socket.id, username ?? null);

		if (!result.ok) {
			socket.emit("room-error", { message: result.error });
			return;
		}

		socket.join(roomCode);

		socket.emit("room-joined", {
			roomCode,
			username: result.joinedRoom.username,
			players: result.joinedRoom.players,
		});

		socket.to(roomCode).emit("room-players", {
			players: result.joinedRoom.players,
		});
	});

	socket.on("set-ready", ({ roomCode, ready }) => {
		const result = setPlayerReady(roomCode, socket.id, ready);
		if (!result) return;

		io.to(roomCode).emit("room-players", {
			players: result.players,
		});
	});

	socket.on("start-game", ({ roomCode }) => {
		const result = startGame(roomCode);
		if (!result) return;

		io.to(roomCode).emit("room-state", {
			state: result.roomState,
		});

		for (const [socketId, hand] of result.gameState.hands.entries()) {
			io.to(socketId).emit("hand", { tiles: hand });
		}
	});

	socket.on("dump", ({ tile, roomCode }) => {
		const newTiles = dumpTile(tile, roomCode, socket.id);
		io.to(socket.id).emit("new-tiles", { newTiles: newTiles });
	});

	socket.on("peel", ({ tilesOnBoard, roomCode }) => {
		peel(tilesOnBoard, roomCode);		
		const room = getRoom(roomCode);
		if (!room) return;

		for (const [socketId, hand] of room.gameState.hands.entries()) {
			io.to(socketId).emit("new-tiles", { newTiles: [hand[hand.length - 1]] });
		}
	});

	socket.on("disconnect", () => {
		const leftRoom = leaveRoomBySocketId(socket.id);

		if (!leftRoom) {
			return;
		}

		setTimeout(() => {
			if (!checkValidRoom(leftRoom.roomCode)) {
				return;
			}

			io.to(leftRoom.roomCode).emit("room-players", {
				players: getRoomPlayers(leftRoom.roomCode),
			});
		}, 5100);
	});
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
