import './KanjiInfo.css'

export function KanjiInfo({ info }) {

  async function copytoClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert('Texto copiado para a área de transferência');
    }
    catch (err) {
      console.log('Falha ao copiar texto:', err)
    }
  }
  if (info) {

    return (
      <>
        <div className='kanji-info'>
          
          <img className='img-stroke-order' onClick={() => { copytoClipboard(info.data.strokeOrderGifUri) }} src={info.data.strokeOrderGifUri} alt="Stroke order" />

          <div className='general-info'>
            <p>Kanji: {info.data.query}</p>
            <p>Taught in: {info.data.taughtIn}</p>
            <p>JLPT level: {info.data.jlptLevel}</p>
            <p>Meaning: {info.data.meaning}</p>
            <p>Kunyomi: {info.data.kunyomi.join('、 ')}</p>
            <p>Onyomi: {info.data.onyomi.join('、 ')}</p>
            <p>Radical: {info.data.radical.symbol} {info.data.radical.forms ? `(${info.data.radical.forms})` : ''} - {info.data.radical.meaning}</p>
            <a className='link-jisho' target='_blank' href={info.data.uri}>Ver no Jisho.com</a>
          </div>

        </div>
      </>
    )
  }

}