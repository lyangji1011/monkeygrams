import { useRef, useEffect, useState } from 'react'
import DraggableLib from 'react-draggable'
import type { DraggableProps } from 'react-draggable'
import { Tile, EmptyTile } from "./Tile"
import { TileData } from '../utils/TileData'

const Draggable = DraggableLib as unknown as React.ComponentType<Partial<DraggableProps>>

function TileMap({ updatedTile, onPlaceTile, addTileToPlayerPile }: { updatedTile: TileData | null; onPlaceTile: (tile_data: TileData) => void; addTileToPlayerPile: (tile_data: TileData) => void }) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const selectedTileRef = useRef<[number, number]>([-1, -1])

  const SIZE = 15;

  const [tiles, setTiles] = useState<Map<string, TileData>>(new Map());
  const [tileGenerations, setTileGenerations] = useState<Map<number, number>>(new Map());
  const getTileKey = (r: number, c: number) => `${r},${c}`;


  useEffect(() => {
    if (!updatedTile) return;

    // Helper function to delete a tile from the tiles map
    function deleteTileHelper(tile_id_to_delete: number) {
      setTiles(prev => {
        const newTiles = new Map(prev);
        for (const [key, tile] of newTiles) {
          if (tile.id === tile_id_to_delete) {
            newTiles.delete(key);
            break;
          }
        }
        return newTiles;
      });
    }

    const selected_r = selectedTileRef.current[0];
    const selected_c = selectedTileRef.current[1];

    // Place tile in new location if valid
    if (selected_r >= 0 && selected_c >= 0 && tiles.get(getTileKey(selected_r, selected_c)) === undefined) {
      deleteTileHelper(updatedTile.id);
      setTiles(prev => {
        const newTiles = new Map(prev);
        const newTile = new TileData(updatedTile.id, updatedTile.letter, selected_r, selected_c);
        newTiles.set(getTileKey(selected_r, selected_c), newTile);
        return newTiles;
      });

    // Handle invalid placement
    } else {
      // Note: no code needed to handle a collision when both tiles were already on TileMap,
      // it's naturally reverted by just not updating the tiles map (not returning newTiles).

      // Placed from PlayerPile, so add it back (but no TileMap tile to delete)
      if ((updatedTile.r == -1 && updatedTile.c == -1)) {
        addTileToPlayerPile(new TileData(updatedTile.id, updatedTile.letter, -1, -1));
      }

      // Placed out of bounds, so delete it and add it to PlayerPile
      else if (selected_r == -1 && selected_c == -1) {
        deleteTileHelper(updatedTile.id);
        addTileToPlayerPile(new TileData(updatedTile.id, updatedTile.letter, -1, -1));
      }
    }

    // Change generation id which forces a re-render since it is used in the key
    setTileGenerations(prev => {
      const newGens = new Map(prev);
      newGens.set(updatedTile.id, (newGens.get(updatedTile.id) ?? 0) + 1);
      return newGens;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedTile]);


  // TODO: currently only covers the tilemap area but it needs to cover the entire page somehow
  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const tile = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
    if (tile && (tile.classList.contains('tile') || tile.classList.contains('tile-empty'))) {
      const rowIndex = Array.from(tile.parentElement!.parentElement!.children).indexOf(tile.parentElement!);
      const colIndex = Array.from(tile.parentElement!.children).indexOf(tile);
      selectedTileRef.current = [rowIndex, colIndex];
    } else {
      selectedTileRef.current = [-1, -1];
    }
  }

  function renderTile(rowIndex: number, colIndex: number) {
    const tile_data = tiles.get(getTileKey(rowIndex, colIndex));
    const generation = tile_data ? tileGenerations.get(tile_data.id) ?? 0 : 0;
    return tile_data
      ? <Tile key={`${tile_data.id}-gen${generation}`} tile_data={tile_data} onPlaceTile={onPlaceTile} />
      : <EmptyTile key={`${rowIndex},${colIndex}`} />;
  }

  return (
    <div className="tilemap-stage" onMouseMove={handleMouseMove}>
      <Draggable nodeRef={nodeRef} enableUserSelectHack cancel=".tile">
        <div ref={nodeRef} className="tilemap">
          {Array.from({ length: SIZE }).map((_, rowIndex) => (
            <div key={rowIndex} className="tile-row">
              {Array.from({ length: SIZE }).map((_, colIndex) => renderTile(rowIndex, colIndex))}
            </div>
          ))}
        </div>
      </Draggable>
    </div>
  )
}

export default TileMap