import axios from 'axios'
import { useEffect, useState } from 'react'
import { KanjiInput } from './components/KanjiInput'
import { KanjiInfo } from './components/KanjiInfo'
import { KanjiVocab } from './components/KanjiVocab'
import { KanjiLists } from './components/KanjiLists'
import { LoadingSpinner } from './components/LoadingSpinner'
import { KanjiPhrases } from './components/KanjiPhrases'
import { AnkiConnect } from './components/AnkiConnect'
import { Analytics } from "@vercel/analytics/next"
import './App.css'

function App() {
  const [kanjiInfo, setKanjiInfo] = useState(null)
  const [kanjiVocab, setKanjiVocab] = useState('')
  const [kanjiPhrases, setKanjiPhrases] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [kanjiInput, setKanjiInput] = useState('')

  const [searchInfo, setSearchInfo] = useState(true)
  const [searchVocab, setSearchVocab] = useState(true)
  const [searchPhrases, setSearchPhrases] = useState(true)

  const [decksAnki, setDecksAnki] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const getDecks = async () => {
      const result = await ankiConnect('deckNames', 5)
      setDecksAnki(result)
    }

    getDecks()
  }, [])

    async function ankiConnect(action, version, params = {}) {
    try {
      const response = await axios.post('http://127.0.0.1:8765', {
        action,
        version,
        params
      });
      const data = response.data;

      if (data.error) {
        throw data.error;
      }

      if (data.result) {
        return data.result;
      } else {
        throw new Error('failed to get results from AnkiConnect');
      }
    } catch (e) {
      if (e.isAxiosError) {
        throw new Error('failed to connect to AnkiConnect');
      }
      throw e;
    }
  }

  async function searchKanjiInfo(kanji) {
    if (kanji !== kanjiInfo?.query) {
      const response = await axios.get(`${API_BASE_URL}/api/kanji/${kanji}/info`)
      setKanjiInfo(response.data)
    }

  }

  async function searchKanjiVocab(kanji) {
    if (kanji !== kanjiVocab?.query) {
      const response = await axios.get(`${API_BASE_URL}/api/kanji/${kanji}/vocab`)
      setKanjiVocab(response.data)
    }

  }

  async function searchKanjiPhrases(kanji) {
    if (kanji !== kanjiPhrases?.query) {
      const response = await axios.get(`${API_BASE_URL}/api/kanji/${kanji}/phrases`)
      setKanjiPhrases(response.data)
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

  async function copytoClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    }
    catch (err) {
      console.log('Falha ao copiar texto:', err)
    }
  }

  return (
    <>
      <div>
        <h1 className='title'>Kanji dic</h1>
        <KanjiLists
          setKanjiInput={setKanjiInput}
          API_BASE_URL={API_BASE_URL}
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
                  copytoClipboard={copytoClipboard}
                />
                <KanjiVocab
                  vocab={kanjiVocab}
                />
                <KanjiPhrases
                  phrases={kanjiPhrases}
                  copytoClipboard={copytoClipboard}
                />
              </>
            )
        }
      </div>
      <AnkiConnect 
        decksAnki={decksAnki}
        ankiConnect={ankiConnect}
        setDecksAnki={setDecksAnki}
      />
    </>
  )
}

export default App
