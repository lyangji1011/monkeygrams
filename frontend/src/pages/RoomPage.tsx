import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

export default function RoomPage() {
	const { roomCode } = useParams();
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [players, setPlayers] = useState<string[]>([]);
	const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5001";
	const roomStorageKey = roomCode
		? `monkeygrams-room-${roomCode}`
		: "monkeygrams-room";

	const copyInviteLink = () => {
		navigator.clipboard.writeText(window.location.href);
		alert("copied!");
	};

	const startGame = () => {
		console.log("start game");
	};

	useEffect(() => {
		if (!roomCode) {
			navigate("/");
			return;
		}

		const savedUsername = localStorage.getItem(roomStorageKey);
		const socket = io(apiUrl);

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
					<li key={player}>{player}</li>
				))}
			</ul>
			<button onClick={copyInviteLink}>copy invite link</button>
			<button onClick={startGame}>start game</button>
		</div>
	);
}
