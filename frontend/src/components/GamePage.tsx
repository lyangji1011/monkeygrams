import TileMap from "./TileMap";
import GameFooter from "./GameFooter";
import { useEffect, useState, type RefObject } from "react";
import type { Tile } from "../../../shared/types/tile";
import type { Socket } from "socket.io-client";

interface GamePageProps {
	hand: Tile[];
	roomCode: string | undefined;
	socketRef: RefObject<Socket | null>;
	onRemoveTileFromHand: (tile: Tile) => void;
	onAddTileToHand: (tile: Tile) => void;
}

function GamePage({
	hand,
	roomCode,
	socketRef,
	onRemoveTileFromHand,
	onAddTileToHand,
}: GamePageProps) {
	const [currentTile, setCurrentTile] = useState<Tile | null>(null); // will update via useEffect in TileMap

	function placeTileFromPlayerHandOntoTileMap(
		e: MouseEvent | null,
		tile: Tile,
	) {
		onRemoveTileFromHand(tile);
		dropTile(e, tile);
	}

	function dropTile(e: MouseEvent | null, tile: Tile) {
		// Check if dropped in Dump Zone
		const elementsAtCursor = document.elementsFromPoint(
			e?.clientX || 0,
			e?.clientY || 0,
		);
		const isOverDropZone = elementsAtCursor.some((el) =>
			el.classList.contains("dump-zone"),
		);
		if (isOverDropZone) {
			handleTileDumped(tile);
		} else {
			// Attempt to place the tile (this triggers useEffect in TileMap)
			setCurrentTile(tile);
		}
	}

	function handleTileDumped(tile: Tile) {
		console.log("DUMP!");
		onRemoveTileFromHand(tile);
		socketRef.current?.emit("dump", { tile, roomCode });
	}

	return (
		<div className="page">
			<TileMap
				updatedTile={currentTile}
				onPlaceTile={(_, placedTile) => setCurrentTile(placedTile)}
				addTileToPlayerHand={onAddTileToHand}
				onTileDumped={handleTileDumped}
			/>
			<GameFooter
				onPlaceTile={placeTileFromPlayerHandOntoTileMap}
				playerHandTiles={hand}
			/>
		</div>
	);
}

export default GamePage;
