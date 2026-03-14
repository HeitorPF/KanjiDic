require('dotenv').config();
const connectDB = require('./src/config/db').default;
const authRoutes = require('./src/routes/authRoutes');
const kanjisRoutes = require('./src/routes/kanjisRoutes');
const userRoutes = require('./src/routes/userRoutes');
const express = require('express');
const cors = require('cors');
const path = require('path');
const JishoAPI = require('unofficial-jisho-api');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(express.json())
const port = process.env.PORT || 3001;

connectDB()

const dominiosPermitidos = ['http://localhost:5173', 'https://kanji-dic.vercel.app'];

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



app.use(cors({
    origin: function (origin, callback) {
        if (!origin || dominiosPermitidos.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado pelo CORS'));
        }
    }
}));

app.use('/api', authRoutes);

app.use('/api', kanjisRoutes);

app.use('/api', userRoutes);

const jisho = new JishoAPI();

app.get('/api/ping', (req, res) => {
    res.status(200).json({ status: 'ativo' });
    console.log('ping testado')
});

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