import './KanjiPhrases.css'

export function KanjiPhrases({ phrases, phraseSelected, setPhraseSelected }) {

  if (phrases) {
    return (
      <div className='kanji-phrases'>
        <table className='kanji-phrases-table'>
          <thead>
            <tr className='kanji-phrases-table-header'>
              <th>Phrase</th>
              <th>Translations</th>
            </tr>
          </thead>

          <tbody>
            {phrases.data.map((phrase, index) => {
              if (phrase.transcriptions[0]?.text && phrase.translations[0]?.text) {
                return (
                  <tr
                    className={`kanji-phrases-table-row ${phraseSelected === index ? 'kanji-phrases-table-selected' : ''}`}
                    key={phrase.id}
                    onClick={() => setPhraseSelected(index)}
                  >
                    <td
                      className='transcriptions'
                      dangerouslySetInnerHTML={{ __html: phrase.transcriptions[0].html }}
                    />
                    <td>{phrase.translations[0].text}</td>
                  </tr>
                )
              }
            })}
          </tbody>

        </table>
      </div>
    )
  }
}