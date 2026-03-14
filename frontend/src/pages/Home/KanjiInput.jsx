import { Search } from 'lucide-react'
import './KanjiInput.css'

export function KanjiInput({ kanjiInput, setKanjiInput, search }) {

  function saveKanjiInput(event) {
    setKanjiInput(event.target.value)
  }

  return (
    <>
      <div className='search'>
        <span
          className="search-icon"
          onClick={() => { search(kanjiInput) }}
        >
          <Search />
        </span>
        <input
          placeholder='犬'
          className="kanji-input"
          onChange={saveKanjiInput}
          value={kanjiInput}
        />
      </div>
    </>
  )
}