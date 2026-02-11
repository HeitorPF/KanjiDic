import { Fragment } from 'react'
import './KanjiPhrases.css'

export function KanjiPhrases({ phrases }) {
  if (phrases) {
    console.log(phrases)
    return (
      <div className='kanji-phrases'>
        <div className='kanji-phrases-grid'>
          <p className='grid-header'>Phrase</p>
          <p className='grid-header'>Translations</p>
          {phrases.data.map((phrase) => {
            if (phrase.transcriptions[0]?.text && phrase.translations[0]?.text) {
              return (
                <Fragment key={phrase.id}>
                  <div className='grid-row transcriptions' dangerouslySetInnerHTML={{ __html: phrase.transcriptions[0].html }} />
                  {/* <div className='grid-row transcriptions'>{phrase.transcriptions[0].html}</div> */}
                  <div className='grid-row translations'>{phrase.translations[0].text}</div>
                </ Fragment>
              )
            }
          })}
        </div>
      </div>
    )
  }
}