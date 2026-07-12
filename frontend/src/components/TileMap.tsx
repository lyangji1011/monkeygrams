import Tile from "./Tile"

function TileMap() {
  
  const tileMap = Array(14).fill(null).map(() => Array(20).fill('L'));

  return (
    <div className="tilemap">
      {tileMap.map((row, rowIndex) => (
        <div key={rowIndex} className="tile-row">
          {row.map((tile, colIndex) => (
            <Tile letter={tile} key={`${rowIndex}-${colIndex}`} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default TileMap