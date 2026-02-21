import './KanjiInfo.css'

export function KanjiInfo({ info, copytoClipboard }) {

  if (info) {
    return (
      <>
        <div className='kanji-info-container'>
          
          <img className='img-stroke-order' onClick={() => { copytoClipboard(info.strokeOrderGifUri) }} src={info.strokeOrderGifUri} alt="Stroke order" />

          <div className='kanji-info'>
            <p>Kanji: {info.query}</p>
            <p>Taught in: {info.taughtIn}</p>
            <p>JLPT level: {info.jlptLevel}</p>
            <p>Meaning: {info.meaning}</p>
            <p>Kunyomi: {info.kunyomi.join('、 ')}</p>
            <p>Onyomi: {info.onyomi.join('、 ')}</p>
            <p>Radical: {info.radical.symbol} {info.radical.forms ? `(${info.radical.forms})` : ''} - {info.radical.meaning}</p>
            <a className='link-jisho' target='_blank' href={info.uri}>Ver no Jisho.com</a>
          </div>

        </div>
      </>
    )
  }

}