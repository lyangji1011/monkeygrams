import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import type { Player } from "../../../shared/types/player";
import { RoomState } from "../../../shared/types/room";
import Lobby from "./Lobby";
import GamePage from "../components/GamePage";

export default function RoomPage() {
	const socketRef = useRef<Socket | null>(null);
	const { roomCode } = useParams();
	const navigate = useNavigate();
	const [username, setUsername] = useState("");

	const [players, setPlayers] = useState<Player[]>([]);
	const currentPlayer = players.find((player) => player.username === username);
	const [roomState, setRoomState] = useState(RoomState.LOBBY);

	const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5001";
	const roomStorageKey = roomCode
		? `monkeygrams-room-${roomCode}`
		: "monkeygrams-room";

	useEffect(() => {
		if (!roomCode) {
			navigate("/");
			return;
		}

		const savedUsername = localStorage.getItem(roomStorageKey);
		const socket = io(apiUrl);
		socketRef.current = socket;

		socket.on("connect", () => {
			socket.emit("join-room", {
				roomCode,
				username: savedUsername,
			});
		});

		socket.on("room-joined", ({ username, players }) => {
			setUsername(username);
			setPlayers(players);
			localStorage.setItem(roomStorageKey, username);
		});

		socket.on("room-players", ({ players }) => {
			setPlayers(players);
		});

		socket.on("room-state", ({ state }) => {
			setRoomState(state);
			console.log(state);
		});

		socket.on("room-error", () => {
			navigate("/");
		});

		return () => {
			socket.disconnect();
			socketRef.current = null;
		};
	}, [apiUrl, navigate, roomCode, roomStorageKey]);

	return (
		<>
			{roomState === RoomState.LOBBY && (
				<Lobby
					username={username}
					roomCode={roomCode}
					players={players}
					currentPlayer={currentPlayer}
					socketRef={socketRef}
				/>
			)}
			{roomState === RoomState.PLAYING && <GamePage />}
		</>
	);
}
