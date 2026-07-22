import { Router } from "express";
import { createRoom, getUsername, checkValidRoom } from "./routes/rooms.js";

const router = Router();

router.get("/message", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

router.post("/rooms", (req, res) => {
  const roomCode = createRoom();
  const username = getUsername(roomCode);
  res.status(201).json({
    code: roomCode,
    username: username,
  });
});

router.post("/names", (req, res) => {
  const isValidRoom = checkValidRoom(req.body.roomCode);
  if (!isValidRoom) {
    return res.status(404).json({
      status: "error",
      message: "room not found",
    });
  }
  const username = getUsername(req.body.roomCode);
  res.status(201).json({
    username: username,
  });
});

export default router;