import TileMap from './TileMap'
import GameHeader from './GameHeader'
import { useState } from 'react';

function GamePage() {

  const [tileToDrop, setTileToDrop] = useState<string | null>(null);
  const [playerPileTiles, setPlayerPileTiles] = useState<string[]>(['L','A','U','R','E','N','🐒']);

  function onDropTile(tile: string) {
    // setPlayerPileTiles(prev => prev.filter(t => t !== tile));
    setTileToDrop(tile);
  }

  return (
    <div className="page">
      <GameHeader onDropTile={onDropTile} playerPileTiles={playerPileTiles} />
      <TileMap tileToDrop={tileToDrop} />
    </div>
  )
}

export default GamePage