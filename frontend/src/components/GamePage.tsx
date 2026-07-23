import TileMap from './TileMap'
import GameHeader from './GameHeader'
import { useState } from 'react';
import { TileData } from '../utils/TileData'

function GamePage() {

  const [updatedTile, setTile] = useState<TileData | null>(null); // will update via useEffect in TileMap
  const [playerPileTiles, setPlayerPileTiles] = useState<TileData[]>([
    new TileData(0, 'L', -1, -1),
    new TileData(1, 'A', -1, -1),
    new TileData(2, 'U', -1, -1),
    new TileData(3, 'R', -1, -1),
    new TileData(4, 'E', -1, -1),
    new TileData(5, 'N', -1, -1),
    new TileData(6, '🐒', -1, -1)
  ])

  function addTileToPlayerPile(tile_data: TileData) {
    setPlayerPileTiles(prev => [...prev, tile_data]);
  }

  function removeTileFromPlayerPile(tile_data: TileData) {
    setPlayerPileTiles(prev => prev.filter(t => t.id !== tile_data.id));
  }

  function placeTileFromPlayerPileOntoTileMap(tile_data: TileData) {
    removeTileFromPlayerPile(tile_data);
    setTile(tile_data);
  }

  return (
    <div className="page">
      <GameHeader onPlaceTile={placeTileFromPlayerPileOntoTileMap} playerPileTiles={playerPileTiles} />
      <TileMap updatedTile={updatedTile} onPlaceTile={setTile} addTileToPlayerPile={addTileToPlayerPile} />
    </div>
  )
}

export default GamePage