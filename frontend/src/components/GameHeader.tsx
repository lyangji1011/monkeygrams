import PlayerPile from './PlayerPile.tsx'
import PlayerActionZone from './PlayerActionZone.tsx'

function GameHeader({ onDropTile, playerPileTiles }: { onDropTile: (tile: string) => void; playerPileTiles: string[] | null }) {
  
  return (
    <div className="game-header">
      <PlayerPile onDropTile={onDropTile} playerPileTiles={playerPileTiles} />
      <PlayerActionZone />
    </div>
  )

}

export default GameHeader