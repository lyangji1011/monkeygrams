import { useLayoutEffect } from 'react'
import TileMap from './components/TileMap'
import GameHeader from './components/GameHeader'

function App() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="page">
      {/* <Bananas />
      <div className="title">
        <h1>MonkeyGrams</h1>
        <p><em>By Lauren and Lucian</em></p>
      </div>
      <HomePageButtons /> */}
      <GameHeader />
      <TileMap />
    </div>
  )
}

export default App
