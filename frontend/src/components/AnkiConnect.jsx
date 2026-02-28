import { Link } from 'react-router'
import { useContext, useEffect } from 'react'
import { AnkiOpenContext } from '../contexts/AnkiOpenContext'
import './AnkiConnect.css'

export function AnkiConnect() {

  const { isAnkiOpen, setIsAnkiOpen } = useContext(AnkiOpenContext)

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnkiOpen])



  return (
    <Link
      className={`anki-connect ${isAnkiOpen ? 'connected' : ''}`}
      to='/ankiSettings'>
      <span className='material-symbols-outlined settings-icon'>
        settings
      </span>
      Configure Anki
    </ Link>
  )
}