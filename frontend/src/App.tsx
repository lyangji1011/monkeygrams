import { useEffect, useState } from 'react'
import HomePageButtons from './components/HomePageButtons'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/message')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div>
      <h1>MonkeyGrams</h1>
      <HomePageButtons />
      <p>Backend says: {message || "Loading..."}</p>
    </div>
  )
}

export default App
