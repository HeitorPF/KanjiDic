import { useState } from 'react';
import './KanjiPhrases.css'

export function KanjiPhrases({ phrases, copytoClipboard }) {

  const [phraseSelected, setPhraseSelected] = useState(null)

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

  if (phrases) {
    return (
      <div className='kanji-phrases'>
        <table className='kanji-phrases-table'>
          <thead>
            <tr className='kanji-phrases-table-header'>
              <th>Phrase</th>
              <th>Translations</th>
            </tr>
          </thead>

          <tbody>
            {phrases.data.map((phrase, index) => {
              if (phrase.transcriptions[0]?.text && phrase.translations[0]?.text) {
                return (
                  <tr
                    className={`kanji-phrases-table-row ${phraseSelected === index ? 'kanji-phrases-table-selected' : ''}`}
                    key={phrase.id}
                    onClick={() => setPhraseSelected(index)}
                  >
                    <td
                      className='transcriptions'
                      onClick={() => { copytoClipboard(formatTatoebaToAnkiDetailed(phrase.transcriptions[0].text)) }}
                      dangerouslySetInnerHTML={{ __html: phrase.transcriptions[0].html }}
                    />
                    <td>{phrase.translations[0].text}</td>
                  </tr>
                )
              }
            })}
          </tbody>

        </table>
      </div>
    )
  }
}