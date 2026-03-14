import { LoaderCircle } from 'lucide-react'
import './LoadingSpinner.css'

export function LoadingSpinner({ size, text='' }) {
  return (
    <div className='loading'>
      <LoaderCircle size={size} color='#0462af' className='icone-girando'/>
      <div className='loading-kanji'>{text}</div>

    </div>
  )
}