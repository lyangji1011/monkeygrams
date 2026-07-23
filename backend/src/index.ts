import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import {
	checkValidRoom,
	getRoom,
	getRoomPlayers,
	joinRoom,
	leaveRoomBySocketId,
} from "./routes/rooms.js";

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("user connected", socket.id);

	socket.on("join-room", ({ roomCode, username }) => {
		if (!checkValidRoom(roomCode)) {
			socket.emit("room-error", { message: "room not found" });
			return;
		}

		const joinedRoom = joinRoom(roomCode, socket.id, username ?? null);

		if (!joinedRoom) {
			socket.emit("room-error", { message: "room not found" });
			return;
		}

		socket.join(roomCode);

		socket.emit("room-joined", {
			roomCode,
			username: joinedRoom.username,
			players: joinedRoom.players,
		});

		socket.to(roomCode).emit("room-players", {
			players: getRoomPlayers(roomCode),
		});
	});

	socket.on("set-ready", ({ roomCode, ready }) => {
		const room = getRoom(roomCode);
		if (!room) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    player.isReady = ready;
    io.to(roomCode).emit("room-players", {
      players: getRoomPlayers(roomCode),
    });
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
