import { Router } from "express";
import { createRoom, joinRoom } from "./routes/rooms.js";

const router = Router();

router.get("/message", (req, res) => {
	res.json({
		message: "Backend is running",
	});
});

router.post("/rooms", (req, res) => {
	const roomCode = createRoom();
	const joinedRoom = joinRoom(roomCode);
	res.status(201).json({
		code: roomCode,
		username: joinedRoom?.username,
	});
});

export default router;