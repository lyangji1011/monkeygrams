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

  function addTileToPlayerHand(tile_data: Tile) {
    setPlayerHandTiles(prev => [...prev, tile_data]);
  }

  function removeTileFromPlayerHand(tile_data: Tile) {
    setPlayerHandTiles(prev => prev.filter(t => t.id !== tile_data.id));
  }

  function placeTileFromPlayerHandOntoTileMap(e: MouseEvent, tile_data: Tile) {
    removeTileFromPlayerHand(tile_data);
    dropTile(e, tile_data);
  }

  function dropTile(e: MouseEvent, tile_data: Tile) {
    // Check if dropped in Dump Zone
    const elementsAtCursor = document.elementsFromPoint(e.clientX, e.clientY);
    const isOverDropZone = elementsAtCursor.some(el => el.classList.contains('dump-zone'));
    if (isOverDropZone) {
      console.log('DUMP!')
    } else {
      // Attempt to place the tile (this triggers useEffect in TileMap)
      setCurrentTile(tile_data);
    }
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
