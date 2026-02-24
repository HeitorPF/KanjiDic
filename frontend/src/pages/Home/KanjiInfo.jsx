import './KanjiInfo.css'

export function KanjiInfo({ info }) {

  if (info) {
    return (
      <>
        <div className='kanji-info-container'>

          <img
            className='img-stroke-order'
            src={info.strokeOrderGifUri}
            alt="Stroke order"
          />

          <div className='kanji-info'>
            <p>Kanji: {info.query}</p>
            <p>Taught in: {info.taughtIn}</p>
            <p>JLPT level: {info.jlptLevel}</p>
            <p>Meaning: {info.meaning}</p>
            <p>Kunyomi: {info.kunyomi}</p>
            <p>Onyomi: {info.onyomi}</p>
            <p>Radical: {info.radical}</p>
            <a className='link-jisho' target='_blank' href={info.uri}>Ver no Jisho.com</a>
          </div>

        </div>
      </>
    )
  }

}