import { useState } from 'react';
import './App.css'

function App() {
  const [kanji, setKanji] = useState('');
  const [data, setData] = useState(null);

  function searchKanji() {
    fetch(`http://localhost:3001/api/kanji/${kanji}`)
      .then(response => response.json())
      .then(result => {
        console.log("Dados recebidos do backend:", result);
        setData(result);
      })
      .catch(err => console.error("Erro:", err));
  };

  return (
    <>
      <div>
        <input type="text" id='inputKanji' onChange={(e) => setKanji(e.target.value)}/>
        <button onClick={searchKanji}>Procurar</button>
        <h1>Meu Dicionário</h1>
        {data ? (
          <div>
            <p>Kanji: {kanji}</p>
            <p>Significado: {data.meaning}</p>
            <img src={data.strokeOrderGifUri} alt="Ordem dos traços" />
          </div>
        ) : (
            <p>Carregando...</p>
        )}
      </div>
    </>
  )
}

export default App
