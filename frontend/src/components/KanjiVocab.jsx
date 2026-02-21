import './KanjiVocab.css'

export function KanjiVocab({ vocab, query }) {
  if (vocab.examples) {
    return (
      <div className='kanji-vocab-container'>
        <div className='kanji-vocab-source'>Words source: {vocab.source}</div>
        <ul className='kanji-vocab-list'>
          {vocab.examples.map((word, index) => {
            return (
              <li className='kanji-vocab-word' key={index}>
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
