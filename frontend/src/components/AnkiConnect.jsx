import { Link } from 'react-router'
import { useState, useEffect } from 'react'
import './AnkiConnect.css'

export function AnkiConnect() {

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

    const intervalId = setInterval(checkAnkiStatus, 3000);

    return () => clearInterval(intervalId);

  }, [isAnkiOpen])


  return (
    <Link
      className={`anki-connect ${isAnkiOpen ? 'connected' : ''}`}
      to='/ankiSettings'>
      Configure Anki
    </ Link>
  )
}