import './KanjiVocab.css'

export function KanjiVocab({ vocab, query, vocabSelected, setVocabSelected }) {

  function selectVocab(index) {
    let array = vocabSelected
    let find = false
    array = array.filter((value) => {
      if (value === index) {
        find = true
        return false
      }
      return true
    })
    if (!find) {
      array.push(index)
    }
    setVocabSelected(array)
  }

  if (vocab.examples) {
    return (
      <div className='kanji-vocab-container'>
        <div className='kanji-vocab-source'>Words source: {vocab.source}</div>
        <ul className='kanji-vocab-list'>
          {vocab.examples.map((word, index) => {
            return (
              <li
                className={`kanji-vocab-word ${vocabSelected.includes(index) ? 'kanji-vocab-word-selected' : ''}`}
                key={index}
                onClick={() => {
                  selectVocab(index)
                }}
              >
                <p>{word.japanese}</p>
                <p>{word.meaning.english}</p>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  else {
    return (
      <div className='error-vocab'>
        {`Failed to find words for "${query}"`}
      </div>
    )
  }
}
