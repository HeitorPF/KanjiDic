import { Home } from './pages/Home/Home'
import { AnkiSettings } from './pages/AnkiSettings/AnkiSettings'
import { Analytics } from "@vercel/analytics/react"
import { Routes, Route } from 'react-router'
import './App.css'
import { AnkiConnect } from './components/AnkiConnect'
import { KanjiDicHeader } from './components/KanjiDicHeader'

function App() {

  return (
    <>
      <title>KanjiDic</title>
      <KanjiDicHeader />

      <Routes>
        <Route index element={<Home />} />
        <Route path='/ankiSettings' element={<AnkiSettings />} />
      </Routes>

      <AnkiConnect />
      <Analytics />
    </>
  )
}

export default App
