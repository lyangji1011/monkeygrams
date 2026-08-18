export interface Tile {
	id: string;
	letter: string;
}

export interface PlacedTile extends Tile {
	r: number;
	c: number;
}
