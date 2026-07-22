import { useLayoutEffect } from 'react'
import Bananas from './components/Bananas'
import HomePageButtons from './components/HomePageButtons'

function App() {
  // Force user to top of page on reload
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="page">
      <Bananas />
      <div className="title">
        <h1>MonkeyGrams</h1>
        <p><em>By Lauren and Lucian</em></p>
      </div>
      <HomePageButtons />
    </div>
  )
}

export default App;