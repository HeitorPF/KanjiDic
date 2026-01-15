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

  function listKanjis(category, level){
    fetch(`http://localhost:3001/api/kanji/${category}/${level}`)
      .then(response => response.json())
      .then(result => {
        console.log(`Dados de ${category} encontrados: `, result)
      })
      .catch(err => console.log('Erro:', err))
  }

  return (
    <>
      <div>
        <input type="text" id='inputKanji' onChange={(e) => setKanji(e.target.value)}/>
        <button onClick={() => searchKanji()}>Procurar</button>
        <button onClick={() => listKanjis('grade', '1')}>grade 1</button>
        <button onClick={() => listKanjis('grade', '2')}>grade 2</button>
        <button onClick={() => listKanjis('grade', '3')}>grade 3</button>
        <button onClick={() => listKanjis('grade', '4')}>grade 4</button>
        <button onClick={() => listKanjis('grade', '5')}>grade 5</button>
        <button onClick={() => listKanjis('grade', '6')}>grade 6</button>
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
