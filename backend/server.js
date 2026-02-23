require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const JishoAPI = require('unofficial-jisho-api');
const fs = require('fs');
const axios = require('axios')

const app = express();
const port = process.env.PORT || 3001;

const dominiosPermitidos = ['http://localhost:5173', 'https://kanji-dic.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || dominiosPermitidos.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado pelo CORS'));
        }
    }
}));

const jisho = new JishoAPI();

app.get('/api/ping', (req, res) => {
    res.status(200).json({ status: 'ativo' });
    console.log('ping testado')
});

app.get('/api/kanji/:category/:level', async (req, res) => {
    const category = req.params.category;
    const level = req.params.level;
    let nameArq = ''

    if (category === 'jlpt') {
        nameArq = `jlpt_${level}.json`;
    } else if (category === 'grade') {
        nameArq = `grade_${level}.json`;
    } else {
        return res.status(400).json({ erro: "Categoria inválida. Use 'jlpt' ou 'grade'." });
    }

    const caminhoArquivo = path.join(__dirname, 'src/data', nameArq);
    console.log('path', caminhoArquivo)
    try {
        const dados = fs.readFileSync(caminhoArquivo, 'utf8');
        const json = JSON.parse(dados);
        res.json(json);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao ler o arquivo de dados." });
    }
})

async function fetchJishoData(kanji) {
    const result = await jisho.searchForKanji(kanji)
    result.onyomi = result.onyomi.join('、 ')
    result.kunyomi = result.kunyomi.join('、 ')
    result.radical = `${result.radical.symbol} ${result.radical.forms ? `(${result.radical.forms})` : ''} - ${result.radical.meaning}`
    result.parts = result.parts.join('、 ')

    return result
}

async function fetchKanjiAliveData(kanji) {
    const apiKey = process.env.KANJIALIVE_API_KEY;
    const result = await axios.get(`https://kanjialive-api.p.rapidapi.com/api/public/kanji/${encodeURIComponent(kanji)}`, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'kanjialive-api.p.rapidapi.com'
        }
    })
    return {
        examples: result.data.examples,
        source: 'KanjiAlive'
    }
}

async function fetchTatoebaData(kanji) {
    const result = await axios.get(`https://api.tatoeba.org/v1/sentences?lang=jpn&q=${encodeURIComponent(kanji)}&word_count=-10&trans%3Alang=eng&sort=relevance&limit=20&include=transcriptions`)
    return result.data
}

app.get('/api/kanji/:character', async (req, res) => {
    const { character } = req.params;
    console.log(`pesquisando por ${character}`)

    const [jishoResult, kanjiAliveResult, tatoebaResult] = await Promise.allSettled([
        fetchJishoData(character),
        fetchKanjiAliveData(character),
        fetchTatoebaData(character)
    ]);

    const jishoData = jishoResult.status === 'fulfilled' ? jishoResult.value : null;
    let vocabData = kanjiAliveResult.status === 'fulfilled' ? kanjiAliveResult.value : [];
    const tatoebaData = tatoebaResult.status === 'fulfilled' ? tatoebaResult.value : [];

    // se não houver exemplos no kanjiAlive, substitui pelos exemplos do Jisho
    if ((!vocabData.examples || vocabData.examples.length === 0) && jishoData) {
        const jishoExamples = [];

        // Verifica os exemplos de Kunyomi em 'jishoData'
        if (jishoData.kunyomiExamples) {
            jishoExamples.push(...jishoData.kunyomiExamples.map(ex => ({
                japanese: ex.example,
                meaning: { english: ex.meaning },
                reading: ex.reading
            })));
        }

        // Verifica os exemplos de Onyomi em 'jishoData'
        if (jishoData.onyomiExamples) {
            jishoExamples.push(...jishoData.onyomiExamples.map(ex => ({
                japanese: ex.example,
                meaning: { english: ex.meaning },
                reading: ex.reading
            })));
        }

        vocabData = {
            examples: jishoExamples,
            source: 'Jisho'
        }
    }

    res.json({
        jisho: jishoData,
        vocabData: vocabData,
        tatoeba: tatoebaData,
        query: character,
        errorInSomeSource: [jishoResult, kanjiAliveResult, tatoebaResult].some(r => r.status === 'rejected')
    });
});

app.listen(port, () => {
    console.log(`Servidor Backend rodando em http://localhost:${port}`);
});