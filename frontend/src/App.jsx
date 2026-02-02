import { useState } from 'react'
import { KanjiInput } from './components/KanjiInput'
import { KanjiInfo } from './components/KanjiInfo'
import { KanjiLists } from './components/KanjiLists'
import { LoadingSpinner } from './components/LoadingSpinner'
import './App.css'

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
