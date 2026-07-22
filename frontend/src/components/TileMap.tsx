import { useRef } from 'react'
import DraggableLib from 'react-draggable'
import type { DraggableProps } from 'react-draggable'
import Tile from "./Tile"

const Draggable = DraggableLib as unknown as React.ComponentType<Partial<DraggableProps>>

function TileMap() {
  const nodeRef = useRef<HTMLDivElement>(null)
  
  const SIZE = 40;
  const tileMap = Array(SIZE).fill(null).map(() => Array(SIZE).fill(''));

  return (
    <div className="tilemap-stage">
      <Draggable nodeRef={nodeRef} enableUserSelectHack>
        <div ref={nodeRef} className="tilemap">
          {tileMap.map((row, rowIndex) => (
            <div key={rowIndex} className="tile-row">
              {row.map((tile, colIndex) => (
                <Tile letter={tile} key={`${rowIndex}-${colIndex}`} />
              ))}
            </div>
          ))}
        </div>
      </Draggable>
    </div>
  )
}

export default TileMap