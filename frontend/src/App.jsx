import { Home } from './pages/Home/Home'
import { AnkiSettings } from './pages/AnkiSettings/AnkiSettings'
import { Analytics } from "@vercel/analytics/react"
import { Routes, Route } from 'react-router'
import { useState, useEffect } from 'react'
import { AnkiConnect } from './components/AnkiConnect'
import { KanjiDicHeader } from './components/KanjiDicHeader'
import { FormLogin } from './components/FormLogin'
import { FormRegister } from './components/FormRegister'
import axios from 'axios'
import './App.css'

function App() {

  const [isAnkiOpen, setIsAnkiOpen] = useState(false)
  const [sideBar, setSideBar] = useState(false)
  const [screen, setScreen] = useState('register')
  const [user, setUser] = useState({})

  async function fetchAnkiData(action, version, params = {}) {
    const response = await axios.post('http://127.0.0.1:8765', {
      action: action,
      version: version,
      params: params
    });
    return response.data.result
  }

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

  function renderScreen() {
    switch (screen) {
      case 'login':
        return (
          <FormLogin
            user={user}
            setUser={setUser}
            setScreen={setScreen}
          />
        )
      case 'register':
        return (
          <FormRegister
            user={user}
            setUser={setUser}
            setScreen={setScreen}
          />
        )

      default:
        return (
          <Login
            user={user}
            setUser={setUser}
            setScreen={setScreen}
          />
        )
    }
  }

  return (
    <div className='app'>
      <div className={`side-bar ${sideBar ? `open` : ''}`}>
        <div className={`side-bar-content ${sideBar ? 'side-bar-content-visible' : ''}`}>
          {renderScreen()}
          <AnkiConnect
            isAnkiOpen={isAnkiOpen}
          />
        </div>

      </div>

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
              isAnkiOpen={isAnkiOpen}
              fetchAnkiData={fetchAnkiData}
            />} />
        </Routes>



        <Analytics />
      </main>

    </div>
  )
}

export default App
