import './KanjiInput.css'

export function KanjiInput({ kanjiInput, setKanjiInput, search }) {

  function saveKanjiInput(event) {
    setKanjiInput(event.target.value)
  }

  return (
    <>
      <div className='search'>
        <span
          className="material-symbols-outlined search-icon"
          onClick={() => { search(kanjiInput) }}
        >
          search
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