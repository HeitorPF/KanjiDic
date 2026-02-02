export function KanjiInfo({data}) {

  return(
    <>
      {data?(
        <div>
          <p>Kanji: {data.query}</p>
          <img src={data.strokeOrderGifUri} alt="Stroke order" />
          <p>Stroke order GIF: {data.strokeOrderGifUri}</p>
          <p>Significado: {data.meaning}</p>
          <p>Taught in: {data.taughtIn}</p>
          <p>JLPT level: {data.jlptLevel}</p>
          <p>Meaning: {data.meaning}</p>
          <p>Kunyomi: {data.kunyomi.join('、 ')}</p>
          <p>Onyomi: {data.onyomi.join('、 ')}</p>
          <p>Radical: {data.radical.symbol} {data.radical.forms ? `(${data.radical.forms})` : ''} - {data.radical.meaning}</p>
          <p>Stroke order diagram: {data.strokeOrderDiagramUri}</p>
          <p>Stroke order SVG: {data.strokeOrderSvgUri}</p>
          <p>Jisho Uri: {data.uri}</p>
          <ul>
            {data.exampleSentences.map((example, index) => {
              if(example.translations[0]){
                return(
                  <li key={index}>
                    {example.text} - {example.translations[0].text}
                  </li>
                )
              }
            })}
          </ul>
        </div>
      ):
      <></>
      }
      
    </>
  )
}