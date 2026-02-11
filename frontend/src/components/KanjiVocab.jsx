import './KanjiVocab.css'

export function KanjiVocab({ vocab }) {
  if (vocab) {
    return (
      <div className='kanji-vocab'>
        <ul className='kanji-vocab-list'>
          {vocab.data.map((word) => {
            return (
                <li className='kanji-vocab-word' key={word.japanese}>
                  <p>{word.japanese}</p>
                  <p>{word.meaning.english}</p>
                </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
