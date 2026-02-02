import { useState } from 'react'
import './KanjiLists.css'

export function KanjiLists({searchKanji}) {
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