import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Modal } from "../../components/Modal"
import "./AnkiSettings.css"

const APP_DATA_OPTIONS = [
  { value: "", label: "" },
  { value: "jisho.query", label: "Kanji" },
  { value: "jisho.meaning", label: "Kanji meaning" },
  { value: "jisho.jlptLevel", label: "JLPT level" },
  { value: "jisho.taughtIn", label: "Grade" },
  { value: "jisho.radical", label: "Radical" },
  { value: "jisho.parts", label: "Kanji parts" },
  { value: "jisho.strokeOrderGifUri", label: "Gif" },
  { value: "jisho.strokeCount", label: "Stroke count" },
  { value: "jisho.onyomi", label: "Onyomi reading" },
  { value: "jisho.kunyomi", label: "Kunyomi reading" },
  { value: "jisho.newspaperFrequencyRank", label: "Frequency" },
  { value: "examples", label: "Vocabulary" },
  { value: "sentenceExample", label: "Sentence example" },
  { value: "translationSentenceExample", label: " Tanslations sentence example" },
]

export function AnkiSettings({ isAnkiOpen, fetchAnkiData }) {
  const navigate = useNavigate()

  const [ankiData, setAnkiData] = useState(null)
  const [exportSettings, setExportSettings] = useState({ deck: '', model: '', fieldMappings: [] })

  async function buildFieldMappings(modelName, currentMappings = []) {
    if (!modelName) return;

    const rawFields = await fetchAnkiData('modelFieldNames', 6, { modelName }) || [];

    const newMappings = rawFields.map(fieldName => {
      const existing = currentMappings.find(item => item.ankiField === fieldName);
      return {
        ankiField: fieldName,
        appField: existing ? existing.appField : ""
      };
    });

    return newMappings
  };

  useEffect(() => {
    async function getAnkiData() {
      try {
        const decks = await fetchAnkiData('deckNames', 6)
        const models = await fetchAnkiData('modelNames', 6)

        setAnkiData({ decks, models })

        let savedSettings = JSON.parse(localStorage.getItem('ankiExportSettings')) || { deck: decks[0], model: models[0], fieldMappings: [] }

        if (!(savedSettings.deck && decks.includes(savedSettings.deck))) {
          savedSettings.deck = decks[0]
        }

        if (!(savedSettings.model && models.includes(savedSettings.model))) {
          savedSettings.model = models[0]
        }

        const updatedMappings = await buildFieldMappings(savedSettings.model, savedSettings.fieldMappings)
        savedSettings.fieldMappings = updatedMappings

        localStorage.setItem('ankiExportSettings', JSON.stringify(savedSettings))
        setExportSettings(savedSettings)

      } catch (error) {
        console.error("Erro ao buscar dados do Anki", error)
      }
    };

    if (isAnkiOpen) {
      getAnkiData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnkiOpen]);

  const handleDeckChange = (e) => {
    const newDeck = e.target.value;
    const newSettings = { ...exportSettings, deck: newDeck }

    setExportSettings(newSettings)
    localStorage.setItem('ankiExportSettings', JSON.stringify(newSettings));
  };

  async function handleModelChange(e) {
    const newModel = e.target.value;
    const newMappings = await buildFieldMappings(newModel, exportSettings.fieldMappings)
    const newSettings = {
      ...exportSettings,
      model: newModel,
      fieldMappings: newMappings
    }

    setExportSettings(newSettings)
    localStorage.setItem('ankiExportSettings', JSON.stringify(newSettings));
  }

  function handleMappingChange(ankiFieldName, newAppFieldValue) {
    const updatedMappings = exportSettings.fieldMappings.map(mapping => {
      if (mapping.ankiField === ankiFieldName) {
        return { ...mapping, appField: newAppFieldValue };
      }
      return mapping;
    });

    const newSettings = { ...exportSettings, fieldMappings: updatedMappings };

    setExportSettings(newSettings);
    localStorage.setItem('ankiExportSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="anki-settings-page">
      <h2>Export Settings</h2>
      <p>Choose where your generated cards will be saved.</p>

      {ankiData ? (
        <div className="settings-form">
          <div className="setting-group">
            <label htmlFor="deck-select">Target Deck:</label>
            <select id="deck-select" value={exportSettings.deck} onChange={handleDeckChange}>
              {ankiData.decks.map((deck) => (
                <option key={deck} value={deck}>{deck}</option>
              ))}
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="model-select">Note Type:</label>
            <select id="model-select" value={exportSettings.model} onChange={handleModelChange}>
              {ankiData.models.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div className="field-names-container">
            {exportSettings.fieldMappings.map((mappingItem) => (
              <Fragment key={mappingItem.ankiField}>
                <label htmlFor={`field-select-${mappingItem.ankiField}`} className="field-names-label">
                  {mappingItem.ankiField}:
                </label>

                <select
                  id={`field-select-${mappingItem.ankiField}`}
                  value={mappingItem.appField}
                  onChange={(e) => handleMappingChange(mappingItem.ankiField, e.target.value)}
                >
                  {APP_DATA_OPTIONS.map((appOption, i) => (
                    <option key={i} value={appOption.value}>
                      {appOption.label}
                    </option>
                  ))}
                </select>
              </Fragment>
            ))}
          </div>
        </div>
      ) : (
        isAnkiOpen && <p>Loading Anki data...</p>
      )}

      <Modal isOpen={!isAnkiOpen} onClose={() => navigate('/')}>
        <div className="modal-error-content">
          <h3>⚠️ Anki Disconnected</h3>
          <p>Please open the Anki app on your computer to configure your cards.</p>
        </div>
      </Modal>
    </div>
  );
}