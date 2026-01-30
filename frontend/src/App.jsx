import { useState } from 'react';
import './App.css'

function KanjiInput({searchKanji, kanjiInput, setKanjiInput}) {

  function saveKanjiInput(event) {
    setKanjiInput(event.target.value)
  }

  return(
    <>
      <input onChange={saveKanjiInput} value={kanjiInput}/>
      <button onClick={() => {searchKanji(kanjiInput)}}>Procurar</button>
    </>
  )
}

function KanjiInfo({data}) {

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

function KanjiLists({searchKanji}) {
  const [listKanjis, setListKanjis] = useState(null)

  function clearList() {
    setListKanjis(null)
  }

  function getListKanjis(category, level){
    fetch(`http://localhost:3001/api/kanji/${category}/${level}`)
      .then(response => response.json())
      .then(result => {
        setListKanjis(result)
      })
      .catch(err => console.log('Erro:', err))
  }

  return(
    <>
      <button onClick={() => getListKanjis('grade', '1')}>grade 1</button>
      <button onClick={() => getListKanjis('grade', '2')}>grade 2</button>
      <button onClick={() => getListKanjis('grade', '3')}>grade 3</button>
      <button onClick={() => getListKanjis('grade', '4')}>grade 4</button>
      <button onClick={() => getListKanjis('grade', '5')}>grade 5</button>
      <button onClick={() => getListKanjis('grade', '6')}>grade 6</button>
      <button onClick={() => getListKanjis('grade', '8')}>grade 8</button>
      <button onClick={clearList}>Clear</button>
      <div className='kanjisList'>
        {listKanjis ? (
          listKanjis.map((kanji, index) => {
            return (
              <div key={index} className='kanji' onClick={() => {searchKanji(kanji)}}>{kanji}</div>
            )
          })
          ) : (
            <>
            </>
          )
        }
      </div>
    </>
  )
}

function LoadingSpinner({kanjiInput}) {
  return (
    <div style={{padding: '20px', fontWeight: 'bold'}}>
      Pesquisando por {kanjiInput}... ⏳
    </div>
  )
}

function App() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [kanjiInput, setKanjiInput] = useState('')

  function searchKanji(kanjiInput) {
    setIsLoading(true)
    setKanjiInput(kanjiInput)
    fetch(`http://localhost:3001/api/kanji/${kanjiInput}`)
      .then(response => response.json())
      .then(result => {
        console.log("Dados recebidos do backend:", result);
        setData(result);
        setIsLoading(false)
        setKanjiInput('')
      })
      .catch(err => console.error("Erro:", err));

  }

  return (
    <>
      <div>
        <KanjiLists 
          searchKanji={searchKanji}
        />

        <h1>Kanji dic</h1>
        <KanjiInput
          kanjiInput={kanjiInput}
          setKanjiInput={setKanjiInput}
          searchKanji={searchKanji}
        />   
        {
          isLoading ? 
          (
            <LoadingSpinner
              kanjiInput={kanjiInput}
            />
          ) : (
            <KanjiInfo 
              data={data} 
            />
          )
        }
      </div>
    </>
  )
}

export default App
