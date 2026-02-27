import axios from 'axios'
import { fit } from 'furigana'
import { useState } from 'react'
import { KanjiInput } from './KanjiInput'
import { KanjiInfo } from './KanjiInfo'
import { KanjiVocab } from './KanjiVocab'
import { KanjiLists } from './KanjiLists'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { KanjiPhrases } from './KanjiPhrases'
import './Home.css'

export function Home({ fetchAnkiData, isAnkiOpen }) {
  const [kanjiData, setKanjiData] = useState(null)

  const [phraseSelected, setPhraseSelected] = useState(null)
  const [vocabSelected, setVocabSelected] = useState([])

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
        setPhraseSelected(null)
        setVocabSelected([])
        await searchKanjiData(kanji)
        setIsLoading(false)
      }
    }
    else {
      alert('Invalid Kanji')
    }
  }

  function adjustingParams() {
    const exportAnkiSettings = JSON.parse(localStorage.getItem('ankiExportSettings'))
    let ankiFields = {}
    let value

    exportAnkiSettings.fieldMappings.forEach((mapping) => {
      if (!mapping.ankiField) {
        ankiFields[mapping.ankiField] = ''
        return
      }

      if (mapping.appField === 'vocabulary') {
        value = []
        console.log(kanjiData.vocabData.examples)
        kanjiData.vocabData.examples.map((example, index) => {
          if (vocabSelected.includes(index)) {
            let parts = example.japanese.split('（')
            const kanji = parts[0]
            const leitura = parts[1].replace('）', '')
            value.push(`${fit(kanji, leitura)} - ${example.meaning.english}`)
          }

        })
        value = value.join(`\n`)
      }
      else if (mapping.appField === 'sentenceExample') {
        value = formatTatoebaToAnkiDetailed(kanjiData.tatoeba.data[phraseSelected].transcriptions[0].text)
      }
      else if (mapping.appField === 'sentenceExampleTranslation') {
        value = kanjiData.tatoeba.data[phraseSelected].translations[0].text
      }
      else {
        value = mapping.appField.split('.').reduce((objetoAtual, propriedadeAtual) => {
          return objetoAtual && objetoAtual[propriedadeAtual] !== undefined
            ? objetoAtual[propriedadeAtual]
            : "";
        }, kanjiData)
      }

      ankiFields[mapping.ankiField] = value
    })

    console.log(ankiFields)
    return ankiFields
  }

  async function addNote() {
    const exportAnkiSettings = JSON.parse(localStorage.getItem('ankiExportSettings'))

    if (!exportAnkiSettings) {
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
    else {
      alert(`Error: ${verify[0].error}`)
    }
  }

  function formatTatoebaToAnkiDetailed(tatoebaString) {
    if (!tatoebaString) return '';

    // Captura tudo que está entre [ ]
    let ankiString = tatoebaString.replace(/\[(.*?)\]/g, (match, conteudo) => {

      // Divide o conteúdo usando o "pipe" (|)
      // Ex: "機械|き|かい" vira ['機械', 'き', 'かい']
      const pedacos = conteudo.split('|');

      const palavra = pedacos[0]; // "機械"
      const leituras = pedacos.slice(1); // ['き', 'かい']

      // Verifica se temos exatamente uma leitura para cada caractere
      if (palavra.length === leituras.length) {
        // Mapeia cada kanji para sua leitura individual
        const kanjisIndividuais = palavra.split('').map((kanji, index) => {
          return ` ${kanji}[${leituras[index]}]`; // O espaço antes do kanji é essencial pro Anki
        });

        // Junta o array resultante em uma string
        return kanjisIndividuais.join('');
      } else {
        // FALLBACK: Se não for 1-para-1 (ex: palavras com okurigana irregular)
        // Ele junta as leituras e coloca na palavra inteira
        return ` ${palavra}[${leituras.join('')}]`;
      }
    });

    // Limpa espaços duplos que possam ter sido gerados e apara as bordas
    return ankiString.replace(/\s+/g, ' ').trim();
  }

  return (
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
          />
          <KanjiVocab
            vocab={kanjiData.vocabData}
            query={kanjiData.query}
            vocabSelected={vocabSelected}
            setVocabSelected={setVocabSelected}
          />
          <KanjiPhrases
            phrases={kanjiData.tatoeba}
            phraseSelected={phraseSelected}
            setPhraseSelected={setPhraseSelected}
          />

          {
            isAnkiOpen && (
              <>
                <hr />
                <div
                  className='add-note-btn'
                  onClick={addNote}
                >Add Note</div>
              </>
            )
          }
        </>
      )}
    </div>
  )
}