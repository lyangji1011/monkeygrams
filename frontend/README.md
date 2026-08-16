## Tile Components

### `TileMap`
The main game board component that displays a 15x15 grid of tiles and handles tile placement/movement logic.

**Props:**
- `updatedTile: Tile | null` - A new tile from the player's hand to be placed on the board
- `onPlaceTile: (e: MouseEvent | null, tileData: Tile | null) => void` - Callback when a tile placement is attempted
- `addTileToPlayerHand: (tileData: Tile) => void` - Callback to return a tile to the player's hand

**State:**
- `tiles: Map<string, Tile>` - Map of placed tiles keyed by `"row,col"`
- `selectedTileRef` - Tracks which grid cell the mouse is currently over

**Key Functions:**
- `handleMouseMove()` - Updates `selectedTileRef` based on mouse position
- `handleTileRemoved()` - Removes a tile from the board
- `handleTileDragged()` - Handles tile placement logic when a tile is dropped (returns to original spot if placement is invalid)
- `renderTile()` - Renders either a `PlacedTile` or `EmptyTile` based on whether the cell contains a tile

### `PlacedTile`
A single tile that has been placed on the board. Handles dragging and positioning.

**Props:**
- `rowIndex: number` - Row position on the board
- `colIndex: number` - Column position on the board
- `tileData: Tile` - The tile data (letter, etc.)
- `onTileRemoved: (rowIndex: number, colIndex: number) => void` - Called when drag starts
- `onTileDragged: (tileData: Tile, origRow: number, origCol: number) => void` - Called when drag ends

**Behavior:**
- Uses `react-draggable` to make tiles draggable
- Tracks position during drag and snaps back to grid on drop
- Calls `onTileRemoved` on drag start, then `onTileDragged` on drop with original position info

### `Tile`
A tile in the player's hand. Draggable and ready to be placed on the board.

**Props:**
- `tile: Tile` - The tile data (letter, etc.)
- `onPlaceTile: (e: MouseEvent | null, tile: Tile) => void` - Called when the tile is dropped

**Behavior:**
- Uses `react-draggable` to make the tile draggable
- When dropped on the board, calls `onPlaceTile` with the tile data

### `EmptyTile`
A visual placeholder for an empty grid cell on the board. Non-interactive.

**Behavior:**
- Renders a dashed border to indicate an available placement location
- Same dimensions as a placed tile for grid alignment