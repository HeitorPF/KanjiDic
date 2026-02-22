import { Home } from './pages/Home/Home'
import { AnkiSettings } from './pages/AnkiSettings/AnkiSettings'
import { Analytics } from "@vercel/analytics/react"
import { Routes, Route } from 'react-router'
import { useState, useEffect } from 'react'
import { AnkiConnect } from './components/AnkiConnect'
import { KanjiDicHeader } from './components/KanjiDicHeader'
import './App.css'

function App() {

  const [isAnkiOpen, setIsAnkiOpen] = useState(false)

  async function checkAnkiStatus() {
    try {
      const response = await fetch('http://127.0.0.1:8765', {
        method: 'POST',
        body: JSON.stringify({ action: 'version', version: 6 })
      })
      if (response.ok) {
        setIsAnkiOpen(true)
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setIsAnkiOpen(false);
    }
  };

  useEffect(() => {

    const intervalId = setInterval(checkAnkiStatus, 1000);

    return () => clearInterval(intervalId);

  }, [isAnkiOpen])


  return (
    <>
      <title>KanjiDic</title>
      <KanjiDicHeader />

      <Routes>
        <Route index element={<Home />} />
        <Route path='/ankiSettings' element={<AnkiSettings isAnkiOpen={isAnkiOpen}/>} />
      </Routes>

      <AnkiConnect isAnkiOpen={isAnkiOpen}/>
      <Analytics />
    </>
  )
}

export default App
