import axios from 'axios'
import { useState } from 'react'
import './KanjiLists.css'

export function KanjiLists({ setKanjiInput }) {
  const [listKanjis, setListKanjis] = useState(null)
  const [gradeSelected, setGradeSelected] = useState(0)
  const [jlptSelected, setJlptSelected] = useState(0)

  const VITE_API_URL = import.meta.env.VITE_API_URL

  function clearList() {
    setListKanjis(null)
    setGradeSelected(null)
    setJlptSelected(null)
  }

  async function getListKanjis(grade = null, jlpt = null) {
    const params = {};

    if (grade) params.grade = grade;
    if (jlpt) params.jlpt = jlpt;


    const response = await axios.get(`${VITE_API_URL}/api/kanjis`, { params })
    setListKanjis(response.data)
  }

  return (
    <>
      <div className='grade-button-container'>
        <button
          className={`grade-button ${gradeSelected === 1 ? 'grade-selected' : ''}`}
          onClick={() => {
            setGradeSelected(1)
            getListKanjis(1, jlptSelected)
          }}>
          Grade 1</button>
        <button
          className={`grade-button ${gradeSelected === 2 ? 'grade-selected' : ''}`}
          onClick={() => {
            setGradeSelected(2)
            getListKanjis(2, jlptSelected)
          }}>Grade 2</button>
        <button
          className={`grade-button ${gradeSelected === 3 ? 'grade-selected' : ''}`}
          onClick={() => {
            setGradeSelected(3)
            getListKanjis(3, jlptSelected)
          }}>Grade 3</button>
        <button
          className={`grade-button ${gradeSelected === 4 ? 'grade-selected' : ''}`}
          onClick={() => {
            setGradeSelected(4)
            getListKanjis(4, jlptSelected)
          }}>Grade 4</button>
        <button
          className={`grade-button ${gradeSelected === 5 ? 'grade-selected' : ''}`}
          onClick={() => {
            setGradeSelected(5)
            getListKanjis(5, jlptSelected)
          }}>Grade 5</button>
        <button
          className={`grade-button ${gradeSelected === 6 ? 'grade-selected' : ''}`}
          onClick={() => {
            setGradeSelected(6)
            getListKanjis(6, jlptSelected)
          }}>
          Grade 6
        </button>
        <button
          className={`grade-button ${gradeSelected === 8 ? 'grade-selected' : ''}`}
          onClick={() => {
            setGradeSelected(8)
            getListKanjis(8, jlptSelected)
          }}>
          Grade 8
        </button>
        <button
          className={`grade-button ${gradeSelected === 9 ? 'grade-selected' : ''}`}
          onClick={() => {
            setGradeSelected(9)
            getListKanjis(9, jlptSelected)
          }}>
          Grade 9
        </button>
        <button
          className={`grade-button ${gradeSelected === 10 ? 'grade-selected' : ''}`}
          onClick={() => {
            setGradeSelected(10)
            getListKanjis(10, jlptSelected)
          }}>Grade 10
        </button>

      </div>
      <div className='jlpt-button-container'>
        <button
          className={`jlpt-button ${jlptSelected === 5 ? 'jlpt-selected' : ''}`}
          onClick={() => {
            setJlptSelected(5)
            getListKanjis(gradeSelected, 5)
          }}>
          JLPT N5
        </button>
        <button
          className={`jlpt-button ${jlptSelected === 4 ? 'jlpt-selected' : ''}`}
          onClick={() => {
            setJlptSelected(4)
            getListKanjis(gradeSelected, 4)
          }}>
          JLPT N4
        </button>
        <button
          className={`jlpt-button ${jlptSelected === 3 ? 'jlpt-selected' : ''}`}
          onClick={() => {
            setJlptSelected(3)
            getListKanjis(gradeSelected, 3)
          }}>
          JLPT N3
        </button>
        <button
          className={`jlpt-button ${jlptSelected === 2 ? 'jlpt-selected' : ''}`}
          onClick={() => {
            setJlptSelected(2)
            getListKanjis(gradeSelected, 2)
          }}>
          JLPT N2
        </button>
        <button
          className={`jlpt-button ${jlptSelected === 1 ? 'jlpt-selected' : ''}`}
          onClick={() => {
            setJlptSelected(1)
            getListKanjis(gradeSelected, 1)
          }}>
          JLPT N1
        </button>
        <button className={`grade-button ${gradeSelected||jlptSelected ? '' : 'grade-selected'}`} onClick={clearList}>
          Clear
        </button>
      </div>
      {listKanjis ? (
        <div className='kanjis-grid'>
          {listKanjis.map((kanji, index) => {
            return (
              <div key={index} className='kanji-button' onClick={() => { setKanjiInput(kanji.kanji) }}>{kanji.kanji}</div>
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