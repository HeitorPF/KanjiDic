import axios from 'axios'
import { useState } from 'react'
import './KanjiLists.css'

export function KanjiLists({ search }) {
  const [listKanjis, setListKanjis] = useState(null)
  const [gradeSelected, setGradeSelected] = useState(0)

  function clearList() {
    setListKanjis(null)
    setGradeSelected(0)
  }

  async function getListKanjis(category, level) {
    const response = await axios.get(`http://localhost:3001/api/kanji/${category}/${level}`)
    setListKanjis(response.data)
    setGradeSelected(level)
  }

  return (
    <>
      <div className='grade-button-container'>
        <button className={`grade-button ${gradeSelected === 1 ? 'grade-selected' : ''}`} onClick={() => getListKanjis('grade', 1)}>Grade 1</button>
        <button className={`grade-button ${gradeSelected === 2 ? 'grade-selected' : ''}`} onClick={() => getListKanjis('grade', 2)}>Grade 2</button>
        <button className={`grade-button ${gradeSelected === 3 ? 'grade-selected' : ''}`} onClick={() => getListKanjis('grade', 3)}>Grade 3</button>
        <button className={`grade-button ${gradeSelected === 4 ? 'grade-selected' : ''}`} onClick={() => getListKanjis('grade', 4)}>Grade 4</button>
        <button className={`grade-button ${gradeSelected === 5 ? 'grade-selected' : ''}`} onClick={() => getListKanjis('grade', 5)}>Grade 5</button>
        <button className={`grade-button ${gradeSelected === 6 ? 'grade-selected' : ''}`} onClick={() => getListKanjis('grade', 6)}>Grade 6</button>
        <button className={`grade-button ${gradeSelected === 8 ? 'grade-selected' : ''}`} onClick={() => getListKanjis('grade', 8)}>Grade 8</button>
        <button className={`grade-button ${gradeSelected === 0 ? 'grade-selected' : ''}`} onClick={clearList}>Clear</button>
      </div>
      {listKanjis ? (
        <div className='kanjisList'>
          {listKanjis.map((kanji, index) => {
            return (
              <div key={index} className='kanji-button' onClick={() => { search(kanji) }}>{kanji}</div>
            )
          })}
        </div>
      ) : (
        <>
        </>
      )
      }
    </>
  )
}