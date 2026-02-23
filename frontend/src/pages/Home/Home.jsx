import axios from 'axios'
import { useState } from 'react'
import { KanjiInput } from './KanjiInput'
import { KanjiInfo } from './KanjiInfo'
import { KanjiVocab } from './KanjiVocab'
import { KanjiLists } from './KanjiLists'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { KanjiPhrases } from './KanjiPhrases'
import { AnkiConnect } from '../../components/AnkiConnect'
import './Home.css'

export function Home({ fetchAnkiData }) {
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

  function adjustingParams() {
    const exportAnkiSettings = JSON.parse(localStorage.getItem('ankiExportSettings'))
    let ankiFields = {}
    exportAnkiSettings.fieldMappings.forEach((mapping) => {
      if (!mapping.ankiField) {
        ankiFields[mapping.ankiField] = ''
        return
      }

      const value = mapping.appField.split('.').reduce((objetoAtual, propriedadeAtual) => {
        return objetoAtual && objetoAtual[propriedadeAtual] !== undefined
          ? objetoAtual[propriedadeAtual]
          : "";
      }, kanjiData)

      ankiFields[mapping.ankiField] = value
    })
    return ankiFields
  }

  async function addNote() {
    const exportAnkiSettings = JSON.parse(localStorage.getItem('ankiExportSettings'))

    if(!exportAnkiSettings){
      alert('You need to configure cards template first')
    }

    const fields = adjustingParams()
    const params = {
      notes: [
        {
          "deckName": exportAnkiSettings.deck,
          "modelName": exportAnkiSettings.model,
          "fields": fields,
          "tags": []
        }
      ]
    }

    const verify = await fetchAnkiData('canAddNotesWithErrorDetail', 6, params)
    console.log(verify)

    if (verify[0].canAdd === true) {
      const result = await fetchAnkiData('addNotes', 6, params)
      if (result[0]) {
        alert('Card created with sucess!')
      }
      else {
        alert('Ocurred an error')
      }
    }
    else{
      alert(`Error: ${verify[0].error}`)
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
            <div
              className='add-note-btn'
              onClick={addNote}
            >Add Note</div>
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