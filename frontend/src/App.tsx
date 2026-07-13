// import { useEffect, useState } from 'react'
import HomePageButtons from './components/HomePageButtons'
import Bananas from './components/Bananas'

function App() {
  // const [message, setMessage] = useState('')

  // useEffect(() => {
  //   fetch('/api/message')
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message))
  //     .catch((err) => console.error(err))
  // }, [])

  return (
    <div className="page">
      <Bananas />
      <div className="title">
        <h1>MonkeyGrams</h1>
        <p><em>By Lauren and Lucian</em></p>
      </div>
      <HomePageButtons />
      <span className="footer"></span>
    </div>
  )
}

export default App
