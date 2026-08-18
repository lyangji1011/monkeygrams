import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import type { Player } from "../../../shared/types/player";
import { RoomState } from "../../../shared/types/room";
import Lobby from "./Lobby";
import GamePage from "../components/GamePage";
import type { Tile } from "../../../shared/types/tile";

export default function RoomPage() {
	const socketRef = useRef<Socket | null>(null);
	const { roomCode } = useParams();
	const navigate = useNavigate();
	const [username, setUsername] = useState("");

	const [players, setPlayers] = useState<Player[]>([]);
	const currentPlayer = players.find((player) => player.username === username);
	const [roomState, setRoomState] = useState(RoomState.LOBBY);
	const [hand, setHand] = useState<Tile[]>([]);

	const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5001";
	const roomStorageKey = roomCode
		? `monkeygrams-room-${roomCode}`
		: "monkeygrams-room";

	function removeTileFromHand(tile: Tile) {
		setHand((currentHand) => currentHand.filter((t) => t.id !== tile.id));
	}

	function addTileToHand(tile: Tile) {
		setHand((currentHand) => [...currentHand, tile]);
	}

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
		});

		socket.on("hand", ({ tiles }) => {
			setHand(tiles);
		});

		socket.on("new-tiles", ({ newTiles }) => {
			setHand((currentHand) => [...currentHand, ...newTiles]);
		});

		socket.on("room-error", ({ message }) => {
			navigate("/");
			alert(message);
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
			{roomState === RoomState.PLAYING && (
				<GamePage
					hand={hand}
					roomCode={roomCode}
					socketRef={socketRef}
					onRemoveTileFromHand={removeTileFromHand}
					onAddTileToHand={addTileToHand}
				/>
			)}
		</>
	);
}
