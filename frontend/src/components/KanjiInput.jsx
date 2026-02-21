import './KanjiInput.css'

export function KanjiInput({ kanjiInput, setKanjiInput, search }) {

  function saveKanjiInput(event) {
    setKanjiInput(event.target.value)
  }

  return (
    <>
      <input placeholder='犬' className="kanji-input" onChange={saveKanjiInput} value={kanjiInput} />
      <button className='search-button' onClick={() => { search(kanjiInput) }}>Search</button>
    </>
  )
}