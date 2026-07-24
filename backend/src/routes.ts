import { Router } from "express";
import { createRoom } from "./routes/rooms.js";

const router = Router();

router.get("/message", (req, res) => {
	res.json({
		message: "Backend is running",
	});
});

router.post("/rooms", (req, res) => {
	const roomCode = createRoom();
	res.status(201).json({
		code: roomCode,
	});
});

export default router;