import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import type { Player } from "../../../shared/types/player";

export default function RoomPage() {
	const socketRef = useRef<Socket | null>(null);
	const { roomCode } = useParams();
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [players, setPlayers] = useState<Player[]>([]);
	const currentPlayer = players.find((player) => player.username === username);
	console.log(currentPlayer?.isReady);
	const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5001";
	const roomStorageKey = roomCode
		? `monkeygrams-room-${roomCode}`
		: "monkeygrams-room";

	const copyInviteLink = () => {
		navigator.clipboard.writeText(window.location.href);
		alert("copied!");
	};

	const setReadiness = (ready: boolean) => {
		socketRef.current?.emit("set-ready", {
			roomCode,
			ready,
		});
	};

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

		socket.on("room-error", () => {
			navigate("/");
		});

		return () => {
			socket.disconnect();
			socketRef.current = null;
		};
	}, [apiUrl, navigate, roomCode, roomStorageKey]);

	return (
		<div>
			<div>room</div>
			<div>your name: {username}</div>
			<div>room code: {roomCode}</div>
			<div>players:</div>
			<ul>
				{players.map((player) => (
					<li key={player.username}>
						{player.username}: {player.isReady ? "ready" : "not ready"}
					</li>
				))}
			</ul>
			<button onClick={copyInviteLink}>copy invite link</button>
			{currentPlayer?.isReady ? (
				<button onClick={() => setReadiness(false)}>ready</button>
			) : (
				<button onClick={() => setReadiness(true)}>not ready</button>
			)}
			<button>start</button>
		</div>
	);
}
