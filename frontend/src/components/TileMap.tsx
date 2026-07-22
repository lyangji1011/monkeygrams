import { useRef, useEffect, useState } from 'react'
import DraggableLib from 'react-draggable'
import type { DraggableProps } from 'react-draggable'
import Tile from "./Tile"

const Draggable = DraggableLib as unknown as React.ComponentType<Partial<DraggableProps>>

function TileMap({ tileToDrop }: { tileToDrop: string | null }) {
  const nodeRef = useRef<HTMLDivElement>(null)
  
  const SIZE = 40;

  const [selectedTile, setSelectedTile] = useState<[number, number]>([-1, -1]);
  const [tileMap, setTileMap] = useState<string[][]>(Array(SIZE).fill(null).map(() => Array(SIZE).fill('')));

  useEffect(() => {
    if (!tileToDrop || !selectedTile) return;

    const selected_x = selectedTile[0];
    const selected_y = selectedTile[1];

    // todo- make this not weird
    setTileMap(prev => {
      const newMap = [...prev];
      newMap[selected_x][selected_y] = tileToDrop;
      return newMap;
    });
  }, [tileToDrop]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const tile = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
    if (tile && tile.classList.contains('tile') || tile.classList.contains('tile-empty')) {
      const rowIndex = Array.from(tile.parentElement!.parentElement!.children).indexOf(tile.parentElement!);
      const colIndex = Array.from(tile.parentElement!.children).indexOf(tile);
      setSelectedTile([rowIndex, colIndex]);
    }
  }

  return (
    <div className="tilemap-stage">
      <Draggable nodeRef={nodeRef} enableUserSelectHack>
        <div ref={nodeRef} className="tilemap" onMouseMove={handleMouseMove}>
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