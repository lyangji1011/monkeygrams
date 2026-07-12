
function Tile({ letter }: { letter: string }) {
  
  return (
    <div className={letter === '' ? 'tile-empty' : 'tile'}>
      {letter}
    </div>
  )

}

export default Tile