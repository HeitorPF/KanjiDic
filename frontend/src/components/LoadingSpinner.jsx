import loading from '/loading.svg'
import './LoadingSpinner.css'

export function LoadingSpinner({ kanjiInput }) {
  return (
    <div className='loading'>
      <div className='loading-kanji'>{kanjiInput}</div>
      <img
        className='img-loading'
        src={loading}
        alt=""
      />
    </div>
  )
}