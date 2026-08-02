export interface Tile {
	id: string;
	letter: string;
}

export interface PlacedTile extends Tile {
	row: number;
	col: number;
}
