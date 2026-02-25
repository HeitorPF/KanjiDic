import { Home } from './pages/Home/Home'
import { AnkiSettings } from './pages/AnkiSettings/AnkiSettings'
import { Analytics } from "@vercel/analytics/react"
import { Routes, Route } from 'react-router'
import { useState, useEffect } from 'react'
import { AnkiConnect } from './components/AnkiConnect'
import { KanjiDicHeader } from './components/KanjiDicHeader'
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
    <div className='app'>
      <title>KanjiDic</title>

      <div className={`side-bar ${sideBar ? `open` : ''}`}>
        <div className='side-bar-btn' onClick={() => { setSideBar(!sideBar) }}>&#9776;</div>

        <div className={`side-bar-content ${sideBar ? 'side-bar-content-visible' : ''}`}>
          <div className='logar'>
            <div className='email-form'>
              <label htmlFor="email">Email:</label>
              <input className='email-input' type="email" id="email" name="email" placeholder="Your email..." />
            </div>

            <div className='password-form'>
              <label htmlFor="password">Password:</label>
              <div className='password-input'>
                <input type="password" id="password" name="password" placeholder="Your password.." />
                <button>O</button>
              </div>
            </div>

            <div className='logar-buttons'>
              <input type="submit" value='Log In' />
              <button>Create Account</button>
            </div>

          </div>

          <AnkiConnect
            isAnkiOpen={isAnkiOpen}
          />
        </div>

      </div>

      <main>
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
