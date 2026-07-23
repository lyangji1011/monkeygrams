import PlayerPile from './PlayerPile.tsx'
import PlayerActionZone from './PlayerActionZone.tsx'
import type { TileData } from '../utils/TileData.ts';

function GameHeader({ onPlaceTile, playerPileTiles }: { onPlaceTile: (tile: TileData) => void; playerPileTiles: TileData[] | null }) {
  
  return (
    <div className="game-header">
      <PlayerPile onPlaceTile={onPlaceTile} playerPileTiles={playerPileTiles} />
      <PlayerActionZone />
    </div>
  )

}

export default GameHeader