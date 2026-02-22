import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Modal } from "../../components/Modal"
import axios from "axios"
import "./AnkiSettings.css"

export function AnkiSettings({ isAnkiOpen }) {
  const navigate = useNavigate()

  const [ankiData, setAnkiData] = useState(null)

  const [selectedDeck, setSelectedDeck] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [modelFieldNames, setModelFieldNames] = useState([])

  async function fetchAnkiData(action, version, params = {}) {
    const response = await axios.post('http://127.0.0.1:8765', {
      action: action,
      version: version,
      params: params
    });
    return response.data.result
  }

  useEffect(() => {
    const getAnkiData = async () => {
      try {

        const decks = await fetchAnkiData('deckNames', 6)
        const models = await fetchAnkiData('modelNames', 6)

        setAnkiData({ decks, models })

        const savedDeck = localStorage.getItem("targetDeck")
        const savedModel = localStorage.getItem("targetModel")

        // Define o deck inicial: usa o salvo SE ele ainda existir no Anki, senão usa o primeiro da lista
        if (savedDeck && decks.includes(savedDeck)) {
          setSelectedDeck(savedDeck);
        } else if (decks.length > 0) {
          setSelectedDeck(decks[0]);
          localStorage.setItem('targetDeck', decks[0])
        }

        // Define o modelo inicial: usa o salvo SE existir, senão usa o primeiro
        if (savedModel && models.includes(savedModel)) {
          setSelectedModel(savedModel);
        } else if (models.length > 0) {
          setSelectedModel(models[0]);
          localStorage.setItem('targetModel', models[0])
        }

        const fieldNames = await fetchAnkiData('modelFieldNames', 6, { modelName: localStorage.getItem('targetModel') })
        setModelFieldNames(fieldNames || [])
        localStorage.setItem('fieldNames', JSON.stringify(fieldNames))

      } catch (error) {
        console.error("Erro ao buscar dados do Anki", error)
      }
    };

    if (isAnkiOpen) {
      getAnkiData()
    }
  }, [isAnkiOpen]);

  // Funções para lidar com as mudanças nos selects e já salvar no navegador
  const handleDeckChange = (e) => {
    const deck = e.target.value;
    setSelectedDeck(deck);
    localStorage.setItem("targetDeck", deck);
  };

  const handleModelChange = async (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    localStorage.setItem("targetModel", model)
  };

  return (
    <div className="anki-settings-page">
      <h2 onClick={() => { //teste de informações
        console.log(ankiData)
        console.log(modelFieldNames)
      }}>Export Settings</h2>
      <p>Choose where your generated cards will be saved.</p>

      {/* Só exibe os formulários se os dados já tiverem carregado */}
      {ankiData ? (
        <div className="settings-form">

          {/* Select de Decks */}
          <div className="setting-group">
            <label htmlFor="deck-select">Target Deck:</label>
            <select
              id="deck-select"
              value={selectedDeck}
              onChange={handleDeckChange}
            >
              {ankiData.decks.map((deck) => (
                <option key={deck} value={deck}>
                  {deck}
                </option>
              ))}
            </select>
          </div>

          {/* Select de Modelos (Tipos de Nota) */}
          <div className="setting-group">
            <label htmlFor="model-select">Note Type:</label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={handleModelChange}
            >
              {ankiData.models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div className="field-names-container">
            <ul>
              {modelFieldNames.map((field, index) => {
                return (
                  <li key={index}>{field}</li>
                )
              })}
            </ul>
          </div>

        </div>
      ) : (
        // Mostra um loading enquanto o Axios está buscando os dados
        isAnkiOpen && <p>Loading Anki data...</p>
      )}

      {/* O Modal de Erro */}
      <Modal
        isOpen={!isAnkiOpen}
        onClose={() => navigate('/')}
      >
        <div className="modal-error-content">
          <h3>⚠️ Anki Disconnected</h3>
          <p>Please open the Anki app on your computer to configure your cards.</p>
        </div>
      </Modal>
    </div>
  );
}