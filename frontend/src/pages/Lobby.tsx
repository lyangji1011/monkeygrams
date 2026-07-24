import type { Socket } from "socket.io-client";
import type { Player } from "../../../shared/types/player";
import type { RefObject } from "react";

export interface LobbyProps {
	username: string;
	roomCode: string | undefined;
	players: Player[];
	currentPlayer: Player | undefined;
	socketRef: RefObject<Socket | null>;
}

export default function Lobby({
	username,
	roomCode,
	players,
	currentPlayer,
	socketRef,
}: LobbyProps) {
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

	const startGame = () => {
		const readyPlayersCount = players.filter((player) => {
			return player.isReady;
		}).length;
		if (readyPlayersCount === players.length) {
			socketRef.current?.emit("start-game", { roomCode });
		} else {
			alert("not all players are ready");
		}
	};

	return (
		<div>
			<div>lobby</div>
			<div>your name: {username}</div>
			<div>room code: {roomCode}</div>
			<div>players:</div>
			<ul>
				{players.map((player: Player) => (
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
			<button onClick={startGame}>start</button>
		</div>
	);
}
