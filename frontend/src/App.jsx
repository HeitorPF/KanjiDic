import { Home } from './pages/Home/Home'
import { AnkiSettings } from './pages/AnkiSettings/AnkiSettings'
import { Account } from './pages/Account/Account'
import { Analytics } from "@vercel/analytics/react"
import { Routes, Route } from 'react-router'
import { useEffect, useState } from 'react'
import { KanjiDicHeader } from './components/KanjiDicHeader'
import { SideBar } from './components/SideBar/SideBar'
import { UserProvider } from './contexts/UserContext'
import { AnkiProvider } from './contexts/AnkiContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Menu, ChevronLeft, Sun, Moon } from 'lucide-react'
import './App.css'

function App() {

  const [sideBar, setSideBar] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    darkMode ? document.body.classList.remove('light-mode') : document.body.classList.add('light-mode')
  }, [darkMode])

  function toggleDarkMode() {
    setDarkMode(!darkMode)
  }

  return (
    <div className='app'>

      <AnkiProvider>
        <UserProvider>
          <SideBar
            sideBar={sideBar}
          />

          <main>

            <div
              className='side-bar-btn'
              onClick={() => { setSideBar(!sideBar) }}
            >
              {sideBar ? <ChevronLeft size={32} /> : <Menu size={32} />}
              
              
            </div>
            <div
              className='side-bar-btn-theme'
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun size={32} /> : <Moon size={32} />}
              
              
            </div>

            <KanjiDicHeader />

            <Routes>
              <Route index element={<Home />} />
              <Route element={<ProtectedRoute />}>
                <Route path='/ankiSettings' element={<AnkiSettings />} />
                <Route path='/account' element={<Account />} />
              </Route>
            </Routes>

            <Analytics />
          </main>
        </UserProvider>
      </AnkiProvider>
    </div>
  )
}

export default App
