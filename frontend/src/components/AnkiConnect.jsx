import './AnkiConnect.css'

export function AnkiConnect({ decksAnki, ankiConnect, setDecksAnki }) {
  async function connectToAnki() {
    if (!decksAnki) {
      const result = await ankiConnect('deckNames', 5)
      setDecksAnki(result)
    }

  }

  return (
    <div
      className={`anki-connect ${decksAnki ? 'connected' : ''}`}
      onClick={connectToAnki}
    >
      AnkiConnect
    </div>
  )
}