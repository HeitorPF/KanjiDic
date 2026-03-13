import { Link } from 'react-router'
import './AnkiConnect.css'

export function AnkiConnect() {

  return (
    <Link
      className={`anki-connect`}
      to='/ankiSettings'>
      <span className='material-symbols-outlined settings-icon'>
        settings
      </span>
      Configure Anki
    </ Link>
  )
}