import TileMap from "./TileMap";
import GameHeader from "./GameHeader";
import { useEffect, useState } from "react";
import type { Tile } from "../../../shared/types/tile";

interface GamePageProps {
	hand: Tile[];
}

function GamePage({ hand }: GamePageProps) {
	const [currentTile, setCurrentTile] = useState<Tile | null>(null); // will update via useEffect in TileMap
	const [playerHandTiles, setPlayerHandTiles] = useState<Tile[]>(hand);

	useEffect(() => {
		setPlayerHandTiles(hand);
	}, [hand]);

	function addTileToPlayerHand(tileData: Tile) {
		setPlayerHandTiles((prev) => [...prev, tileData]);
	}

	function removeTileFromPlayerHand(tileData: Tile) {
		setPlayerHandTiles((prev) => prev.filter((t) => t.id !== tileData.id));
	}

	function placeTileFromPlayerHandOntoTileMap(tileData: Tile) {
		removeTileFromPlayerHand(tileData);
		setCurrentTile(tileData);
	}

	return (
		<div className="page">
			<GameHeader
				onPlaceTile={placeTileFromPlayerHandOntoTileMap}
				playerHandTiles={playerHandTiles}
			/>
			<TileMap
				updatedTile={currentTile}
				onPlaceTile={setCurrentTile}
				addTileToPlayerHand={addTileToPlayerHand}
			/>
		</div>
	);
}

export default GamePage;
