import './KanjiInput.css'

export function KanjiInput({ kanjiInput, setKanjiInput, searchInfo, setSearchInfo, searchVocab, setSearchVocab, searchPhrases, setSearchPhrases, search }) {

  function saveKanjiInput(event) {
    setKanjiInput(event.target.value)
  }

  return (
    <>
      <div className='options-container'>
        <button className={`options-button ${searchInfo ? 'active' : ''}`} onClick={() => { setSearchInfo(!searchInfo) }}>Info</button>
        <button className={`options-button ${searchVocab ? 'active' : ''}`} onClick={() => { setSearchVocab(!searchVocab) }}>Vocab</button>
        <button className={`options-button ${searchPhrases ? 'active' : ''}`} onClick={() => { setSearchPhrases(!searchPhrases) }}>Examples</button>
      </div>


      <input placeholder='犬' className="kanji-input" onChange={saveKanjiInput} value={kanjiInput} />
      <button className='search-button' onClick={() => {search(kanjiInput)}}>Search</button>

    </>
  )
}