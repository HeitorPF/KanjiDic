import axios from 'axios'
import { useState } from 'react'
import { KanjiDicHeader } from '../../components/KanjiDicHeader'
import { KanjiInput } from './KanjiInput'
import { KanjiInfo } from './KanjiInfo'
import { KanjiVocab } from './KanjiVocab'
import { KanjiLists } from './KanjiLists'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { KanjiPhrases } from './KanjiPhrases'
import { AnkiConnect } from '../../components/AnkiConnect'

export function Home() {
  const [kanjiData, setKanjiData] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [kanjiInput, setKanjiInput] = useState('')

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  function isKanji(string) {
    string = string.trim()
    const regexKanji = /^\p{Script=Han}+$/u;
    return regexKanji.test(string)
  }


  async function searchKanjiData(kanji) {
    const response = await axios.get(`${API_BASE_URL}/api/kanji/${kanji}`)
    setKanjiData(response.data)
  }

  async function search(kanji) {
    if (isKanji(kanji)) {
      if (!(kanji === kanjiData?.query)) {
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
      <AnkiConnect />
    </>
  )
}