import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Modal } from "../../components/Modal"
import axios from "axios"
import "./AnkiSettings.css"


export function AnkiSettings({ isAnkiOpen }) {
  const navigate = useNavigate()

  const [ankiData, setAnkiData] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState({ deck: '', model: '', mapping: [] })

  async function fetchAnkiData(action, version, params = {}) {
    const response = await axios.post('http://127.0.0.1:8765', {
      action: action,
      version: version,
      params: params
    });
    return response.data.result
  }


  async function buildFieldMappings() {
    const modelName = JSON.parse(localStorage.getItem('selectedOptions')).model
    if (!modelName) return;

    const rawFields = await fetchAnkiData('modelFieldNames', 6, { modelName }) || [];

    const savedMappings = JSON.parse(localStorage.getItem('selectedOptions')).mapping || [];

    const newMappings = rawFields.map(fieldName => {
      const existing = savedMappings.find(item => item.field === fieldName);
      return {
        field: fieldName,
        option: existing ? existing.option : "" // Mantém a escolha ou começa vazio
      };
    });

    localStorage.setItem('selectedOptions', JSON.stringify({ ...JSON.parse(localStorage.getItem('selectedOptions')), mapping: newMappings }));
    setSelectedOptions(JSON.parse(localStorage.getItem('selectedOptions')))
  };

  useEffect(() => {
    async function getAnkiData() {
      try {
        const decks = await fetchAnkiData('deckNames', 6)
        const models = await fetchAnkiData('modelNames', 6)

        setAnkiData({ decks, models })

        let options = JSON.parse(localStorage.getItem('selectedOptions')) || { deck: decks[0], model: models[0], mapping: [] }
        
        if (!(options.deck && decks.includes(options.deck))) {
          options = { ...options, deck: decks[0] }
        }

        if (!(options.model && models.includes(options.model))) {
          options = { ...options, model: models[0] }
        }

        localStorage.setItem('selectedOptions', JSON.stringify(options))
        setSelectedOptions(options)
        buildFieldMappings()

      } catch (error) {
        console.error("Erro ao buscar dados do Anki", error)
      }
    };

    if (isAnkiOpen) {
      getAnkiData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnkiOpen]);

  // const options = [
  //   { value: "", label: "--- Ignorar (Deixar Vazio) ---" },
  //   { value: "kanji", label: "Kanji Principal" },
  //   { value: "meaning", label: "Significado do Kanji" },
  //   { value: "sentence_furigana", label: "Frase do Tatoeba (com Furigana)" },
  //   { value: "sentence_translation", label: "Tradução da Frase" },
  // ]


  // Funções para lidar com as mudanças nos selects e já salvar no navegador
  const handleDeckChange = (e) => {
    const deck = e.target.value;
    setSelectedOptions({ ...selectedOptions, deck: deck })
    localStorage.setItem('selectedOptions', JSON.stringify({ ...selectedOptions, deck: deck }));
  };

  const handleModelChange = async (e) => {
    const model = e.target.value;
    setSelectedOptions({ ...selectedOptions, model: model })
    localStorage.setItem('selectedOptions', JSON.stringify({ ...selectedOptions, model: model }));
    buildFieldMappings()
  };

  return (
    <div className="anki-settings-page">
      <h2 onClick={() => { console.log(selectedOptions) }}>Export Settings</h2>
      <p>Choose where your generated cards will be saved.</p>

      {/* Só exibe os formulários se os dados já tiverem carregado */}
      {ankiData ? (
        <div className="settings-form">

          {/* Select de Decks */}
          <div className="setting-group">
            <label htmlFor="deck-select">Target Deck:</label>
            <select
              id="deck-select"
              value={selectedOptions.deck}
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
              value={selectedOptions.model}
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
              {selectedOptions.mapping.map((field, index) => {
                return (
                  <li key={index}>{field.field} - {field.option}</li>
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