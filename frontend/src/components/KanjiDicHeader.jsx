import { Link } from 'react-router'
import './KanjiDicHeader.css'

export function KanjiDicHeader(){
  return(
    <div className='kanji-dic-header'>
      <Link to='/' className='title'>Kanji dic</Link>
    </div>
    
  )
}