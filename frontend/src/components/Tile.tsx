import { memo, useRef } from 'react'
import { TileData } from '../utils/TileData'
import DraggableLib from 'react-draggable'
import type { DraggableProps } from 'react-draggable'

const Draggable = DraggableLib as unknown as React.ComponentType<Partial<DraggableProps>>

const Tile = memo(function Tile({ tile_data, onPlaceTile }: { tile_data: TileData; onPlaceTile: (tile_data: TileData) => void }) {

  const nodeRef = useRef<HTMLDivElement>(null)

  return (
    <Draggable
      nodeRef={nodeRef}
      enableUserSelectHack
      onStop={() => {onPlaceTile(tile_data.shallow_copy())}}>
      <div ref={nodeRef} className='tile'>
        {tile_data.letter}
      </div>
    </Draggable>
  )
})


function EmptyTile() {
  return <div className='tile-empty' />
}


export { Tile, EmptyTile }