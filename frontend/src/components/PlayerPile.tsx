import { useMemo } from 'react'
import DraggableLib from 'react-draggable'
import type { DraggableProps } from 'react-draggable'
import { TileData } from '../utils/TileData'

const Draggable = DraggableLib as unknown as React.ComponentType<Partial<DraggableProps>>

function PlayerPile({ onPlaceTile, playerPileTiles }: { onPlaceTile: (tile: TileData) => void; playerPileTiles: TileData[] | null }) {

  const tileRefs = useMemo(() => {
    const refs = new Map<number, React.RefObject<HTMLDivElement>>()
    playerPileTiles?.forEach((tile) => {
      refs.set(tile.id, { current: null })
    })
    return refs
  }, [playerPileTiles])

  return (
    <div className="player-pile">
      {playerPileTiles?.map((tile) => (
        <Draggable
          nodeRef={tileRefs.get(tile.id)!}
          key={tile.id}
          enableUserSelectHack
          onStop={() => onPlaceTile(tile)}
        >
          <div
            ref={tileRefs.get(tile.id)!}
            className="tile"
          >
            {tile.letter}
          </div>
        </Draggable>
      ))}
    </div>
  )

}

export default PlayerPile