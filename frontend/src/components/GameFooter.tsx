import PlayerHand from "./PlayerHand";
import DumpZone from "./DumpZone";
import type { Tile } from "../../../shared/types/tile";
import PlayerActionButtons from "./PlayerActionButtons";
import type { Socket } from "socket.io-client";
import type { RefObject } from "react";

export default function GameFooter({
	onPlaceTile,
	playerHandTiles,
	socketRef,
	roomCode,
	tilesOnBoard,
}: {
	onPlaceTile: (e: MouseEvent | null, tile: Tile) => void;
	playerHandTiles: Tile[] | null;
	socketRef: RefObject<Socket | null>;
	roomCode: string | undefined;
	tilesOnBoard: Map<string, Tile>;
}) {
	return (
		<div className="game-footer">
			<PlayerActionButtons socketRef={socketRef} roomCode={roomCode} tilesOnBoard={tilesOnBoard} />
			<PlayerHand onPlaceTile={onPlaceTile} playerHandTiles={playerHandTiles} />
			<DumpZone />
		</div>
	);
}
