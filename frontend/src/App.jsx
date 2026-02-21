import axios from 'axios'
import { useEffect, useState } from 'react'
import { KanjiInput } from './components/KanjiInput'
import { KanjiInfo } from './components/KanjiInfo'
import { KanjiVocab } from './components/KanjiVocab'
import { KanjiLists } from './components/KanjiLists'
import { LoadingSpinner } from './components/LoadingSpinner'
import { KanjiPhrases } from './components/KanjiPhrases'
import { AnkiConnect } from './components/AnkiConnect'
import { Analytics } from "@vercel/analytics/react"
import './App.css'

function App() {
  const [kanjiData, setKanjiData] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [kanjiInput, setKanjiInput] = useState('')

  const [decksAnki, setDecksAnki] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const getDecks = async () => {
      const result = await ankiConnect('deckNames', 5)
      setDecksAnki(result)
    }

    getDecks()
  }, [])

  function isKanji(string) {
    string = string.trim()
    const regexKanji = /^\p{Script=Han}+$/u;
    return regexKanji.test(string)
  }

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

  async function searchKanjiData(kanji) {
    const response = await axios.get(`${API_BASE_URL}/api/kanji/${kanji}`)
    setKanjiData(response.data)
  }

  async function search(kanji) {
    if (isKanji(kanji)) {
      if (!(kanji === kanjiData.query)) {
        setIsLoading(true)
        await searchKanjiData(kanji)
        setIsLoading(false)
      }
    }
    else {
      alert('Invalid Kanji')
    }
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
          search={search}
        />

        {isLoading && (
          <LoadingSpinner kanjiInput={kanjiInput} />
        )}

        {!isLoading && kanjiData && (
          <>
            <KanjiInfo
              info={kanjiData.jisho}
              copytoClipboard={copytoClipboard}
            />
            <KanjiVocab
              vocab={kanjiData.vocabData}
              query={kanjiData.query}
            />
            <KanjiPhrases
              phrases={kanjiData.tatoeba}
              copytoClipboard={copytoClipboard}
            />
          </>
        )}
      </div>
      <AnkiConnect
        decksAnki={decksAnki}
        ankiConnect={ankiConnect}
        setDecksAnki={setDecksAnki}
      />

      <Analytics />
    </>
  )
}

export default App
