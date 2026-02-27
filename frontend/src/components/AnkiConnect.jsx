import { Link } from 'react-router'
import './AnkiConnect.css'

export function AnkiConnect({ isAnkiOpen }) {

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