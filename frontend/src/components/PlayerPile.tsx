import { useRef } from 'react'
import DraggableLib from 'react-draggable'
import type { DraggableProps } from 'react-draggable'

const Draggable = DraggableLib as unknown as React.ComponentType<Partial<DraggableProps>>

function PlayerPile({ onDropTile, playerPileTiles }: { onDropTile: (tile: string) => void; playerPileTiles: string[] | null }) {

  const nodeRef = useRef<HTMLDivElement>(null)

  return (
    <div className="player-pile">
      {playerPileTiles?.map((tile, index) => (
        <Draggable nodeRef={nodeRef} key={index} enableUserSelectHack onStop={() => onDropTile(tile)}>
          <div ref={nodeRef} className="tile">
            {tile}
          </div>
        </Draggable>
      ))}
    </div>
  )

}

export default PlayerPile