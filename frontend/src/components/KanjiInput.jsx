export function KanjiInput({searchKanji, kanjiInput, setKanjiInput}) {

  function saveKanjiInput(event) {
    setKanjiInput(event.target.value)
  }

  return(
    <>
      <input onChange={saveKanjiInput} value={kanjiInput}/>
      <button onClick={() => {searchKanji(kanjiInput)}}>Procurar</button>
    </>
  )
}