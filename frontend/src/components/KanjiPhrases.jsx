import { Fragment } from 'react'
import './KanjiPhrases.css'

export function KanjiPhrases({ phrases, copytoClipboard }) {

  const convertToAnkiFormat = (htmlString) => {
    if (!htmlString) return "";

    return htmlString
      // 1. Remove tags <rp> e seu conteúdo (parênteses de fallback)
      .replace(/<rp>.*?<\/rp>/g, '')
      // 2. Regex aprimorado: captura o texto base e o furigana, 
      // ignorando espaços extras ou outras tags internas.
      .replace(/<ruby>\s*([\s\S]*?)\s*<rt>\s*([\s\S]*?)\s*<\/rt>\s*<\/ruby>/g, ' $1[$2]')
      // 3. Limpeza final: remove espaços duplos e espaços antes de pontuação japonesa
      .replace(/\s+/g, ' ')
      .replace(/\s([。、！?？])/g, '$1')
      .trim();
  };

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
                  <div onClick={() => {
                    copytoClipboard(convertToAnkiFormat(phrase.transcriptions[0].html))
                  }} className='grid-row transcriptions' dangerouslySetInnerHTML={{ __html: phrase.transcriptions[0].html }} />
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