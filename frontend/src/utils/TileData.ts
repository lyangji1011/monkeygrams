export class TileData {
  constructor(
    public id: number,
    public letter: string,
    public r: number,
    public c: number
  ) {}

  static create(id: number, letter: string, r: number = -1, c: number = -1): TileData {
    return new TileData(id, letter, r, c)
  }
}
