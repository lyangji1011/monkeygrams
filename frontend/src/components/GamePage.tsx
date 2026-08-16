import TileMap from "./TileMap";
import GameFooter from "./GameFooter";
import { useEffect, useState } from "react";
import type { Tile } from "../../../shared/types/tile";

interface GamePageProps {
	hand: Tile[];
}

function GamePage({ hand }: GamePageProps) {
	const [currentTile, setCurrentTile] = useState<Tile | null>(null); // will update via useEffect in TileMap
	const [playerHandTiles, setPlayerHandTiles] = useState<Tile[]>(hand);

	useEffect(() => {
    // eslint-disable-next-line
		setPlayerHandTiles(hand);
	}, [hand]);

  function addTileToPlayerHand(tile_data: Tile) {
    setPlayerHandTiles(prev => [...prev, tile_data]);
  }

  function removeTileFromPlayerHand(tile_data: Tile) {
    setPlayerHandTiles(prev => prev.filter(t => t.id !== tile_data.id));
  }

  function placeTileFromPlayerHandOntoTileMap(e: MouseEvent | null, tile_data: Tile) {
    removeTileFromPlayerHand(tile_data);
    dropTile(e, tile_data);
  }

  function dropTile(e: MouseEvent | null, tile_data: Tile) {
    // Check if dropped in Dump Zone
    const elementsAtCursor = document.elementsFromPoint(e?.clientX || 0, e?.clientY || 0);
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
			<TileMap
				updatedTile={currentTile}
				onPlaceTile={(_, tile) => setCurrentTile(tile)}
				addTileToPlayerHand={addTileToPlayerHand}
			/>
			<GameFooter
				onPlaceTile={placeTileFromPlayerHandOntoTileMap}
				playerHandTiles={playerHandTiles}
			/>
		</div>
	);
}

export default GamePage;
