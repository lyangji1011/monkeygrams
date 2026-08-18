import TileMap from "./TileMap";
import GameFooter from "./GameFooter";
import { useState, useRef, useEffect, type RefObject } from "react";
import type { Tile } from "../../../shared/types/tile";
import type { Socket } from "socket.io-client";
import dumpSound from "../assets/sounds/dump.mp3";

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
	const [tilesOnBoard, setTilesOnBoard] = useState<Map<string, Tile>>(new Map());
	const dumpAudioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		dumpAudioRef.current = new Audio(dumpSound);
	}, []);

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
		if (dumpAudioRef.current) {
			dumpAudioRef.current.currentTime = 0;
			dumpAudioRef.current.play();
		}
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
				onTilesChange={setTilesOnBoard}
			/>
			<GameFooter
				onPlaceTile={placeTileFromPlayerHandOntoTileMap}
				playerHandTiles={hand}
				socketRef={socketRef}
				roomCode={roomCode}
				tilesOnBoard={tilesOnBoard}
			/>
		</div>
	);
}

export default GamePage;
