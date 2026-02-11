import axios from 'axios'
import { useState } from 'react'
import { KanjiInput } from './components/KanjiInput'
import { KanjiInfo } from './components/KanjiInfo'
import { KanjiVocab } from './components/KanjiVocab'
import { KanjiLists } from './components/KanjiLists'
import { LoadingSpinner } from './components/LoadingSpinner'
import { KanjiPhrases } from './components/KanjiPhrases'
import './App.css'

function App() {
  const [kanjiInfo, setKanjiInfo] = useState(null)
  const [kanjiVocab, setKanjiVocab] = useState(null)
  const [kanjiPhrases, setKanjiPhrases] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [kanjiInput, setKanjiInput] = useState('')

  const [searchInfo, setSearchInfo] = useState(false)
  const [searchVocab, setSearchVocab] = useState(false)
  const [searchPhrases, setSearchPhrases] = useState(false)

  async function searchKanjiInfo(kanji) {
    if (kanji !== kanjiInfo?.query) {
      const response = await axios.get(`http://localhost:3001/api/kanji/${kanji}/info`)
      setKanjiInfo({
        data: response.data,
        query: kanji
      })
      setIsLoading(false)
    }

  }

  async function searchKanjiVocab(kanji) {
    if (kanji !== kanjiVocab?.query) {
      const response = await axios.get(`http://localhost:3001/api/kanji/${kanji}/vocab`)
      setKanjiVocab({
        data: response.data,
        query: kanji
      })
      setIsLoading(false)
    }

  }

  async function searchKanjiPhrases(kanji) {
    if (kanji !== kanjiPhrases?.query) {
      const response = await axios.get(`http://localhost:3001/api/kanji/${kanji}/phrases`)
      setKanjiPhrases({
        data: response.data,
        query: kanji
      })
      setIsLoading(false)
    }
  }

  async function search(kanji) {
    setKanjiInput(kanji)
    setIsLoading(true)
    searchInfo ? await searchKanjiInfo(kanji) : setKanjiInfo('')
    searchVocab ? await searchKanjiVocab(kanji) : setKanjiVocab('')
    searchPhrases ? await searchKanjiPhrases(kanji) : setKanjiPhrases('')
    setIsLoading(false)
  }

  return (
    <>
      <div>
        <h1>Kanji dic</h1>
        <KanjiLists
          search={search}
        />


        <KanjiInput
          kanjiInput={kanjiInput}
          setKanjiInput={setKanjiInput}
          searchInfo={searchInfo}
          setSearchInfo={setSearchInfo}
          searchVocab={searchVocab}
          setSearchVocab={setSearchVocab}
          searchPhrases={searchPhrases}
          setSearchPhrases={setSearchPhrases}
          search={search}
        />
        {
          isLoading ?
            (
              <LoadingSpinner
                kanjiInput={kanjiInput}
              />
            ) : (
              <>
                <KanjiInfo
                  info={kanjiInfo}
                />
                <KanjiVocab
                  vocab={kanjiVocab}
                />
                <KanjiPhrases
                  phrases={kanjiPhrases}
                />
              </>
            )
        }
      </div>
    </>
  )
}

export default App
