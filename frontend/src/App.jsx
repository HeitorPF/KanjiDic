import { Home } from './pages/Home/Home'
import { AnkiSettings } from './pages/AnkiSettings/AnkiSettings'
import { Analytics } from "@vercel/analytics/react"
import { Routes, Route } from 'react-router'
import { useState } from 'react'
import { KanjiDicHeader } from './components/KanjiDicHeader'
import { SideBar } from './components/SideBar/SideBar'
import { AnkiOpenContext } from './contexts/AnkiOpenContext'
import { UserProvider } from './contexts/UserContext'
import axios from 'axios'
import './App.css'

function App() {

  const [isAnkiOpen, setIsAnkiOpen] = useState(false)
  const [sideBar, setSideBar] = useState(false)

  async function fetchAnkiData(action, version, params = {}) {
    const response = await axios.post('http://127.0.0.1:8765', {
      action: action,
      version: version,
      params: params
    });
    return response.data.result
  }

  return (
    <div className='app'>

      <AnkiOpenContext.Provider value={{ isAnkiOpen, setIsAnkiOpen }}>
        <UserProvider>
          <SideBar
            sideBar={sideBar}
          />

          <main>
            <div
              className='side-bar-btn material-symbols-outlined'
              onClick={() => { setSideBar(!sideBar) }}
            >
              {sideBar ? 'arrow_back' : 'menu'}
            </div>

            <KanjiDicHeader />

            <Routes>
              <Route index element={
                <Home
                  fetchAnkiData={fetchAnkiData}
                  isAnkiOpen={isAnkiOpen}
                />} />
              <Route path='/ankiSettings' element={
                <AnkiSettings
                  fetchAnkiData={fetchAnkiData}
                />} />
            </Routes>

            <Analytics />
          </main>
        </UserProvider>
      </AnkiOpenContext.Provider>
    </div>
  )
}

export default App
