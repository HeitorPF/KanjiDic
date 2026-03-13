import { Home } from './pages/Home/Home'
import { AnkiSettings } from './pages/AnkiSettings/AnkiSettings'
import { Analytics } from "@vercel/analytics/react"
import { Routes, Route } from 'react-router'
import { useState } from 'react'
import { KanjiDicHeader } from './components/KanjiDicHeader'
import { SideBar } from './components/SideBar/SideBar'
import { UserProvider } from './contexts/UserContext'
import { AnkiProvider } from './contexts/AnkiContext'
import './App.css'

function App() {

  const [sideBar, setSideBar] = useState(false)

  return (
    <div className='app'>

      <AnkiProvider>
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
                <Home                />} />
              <Route path='/ankiSettings' element={
                <AnkiSettings                />} />
            </Routes>

            <Analytics />
          </main>
        </UserProvider>
      </AnkiProvider>
    </div>
  )
}

export default App
