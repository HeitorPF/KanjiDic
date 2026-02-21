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

app.get('/api/kanji/:character/vocab', async (req, res) => { //KanjiAliveAPI
    const kanji = req.params.character;

    try {
        console.log(`Buscando vocabulário para kanji: ${kanji}`)
        const apiKey = process.env.KANJIALIVE_API_KEY;
        const kanjiAliveResponse = await fetch(`https://kanjialive-api.p.rapidapi.com/api/public/kanji/${encodeURIComponent(kanji)}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'kanjialive-api.p.rapidapi.com'
            }
        })
        const result = await kanjiAliveResponse.json()
        res.json({ data: result.examples, query: kanji });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

app.get('/api/kanji/:character/info', async (req, res) => {
    const kanji = req.params.character;

    try {
        console.log(`Buscando informações para kanji: ${kanji}`)
        const result = await jisho.searchForKanji(kanji)

        res.json({ data: result, query: kanji });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

app.get('/api/kanji/:character/phrases', async (req, res) => {
    const kanji = req.params.character;

    try {
        console.log(`Buscando frases exemplo para kanji: ${kanji}`)
        const tatoebaResponse = await fetch(`https://api.tatoeba.org/v1/sentences?lang=jpn&q=${encodeURIComponent(kanji)}&word_count=-10&trans%3Alang=eng&sort=relevance&limit=20&include=transcriptions`);
        const result = await tatoebaResponse.json();

        res.json({ data: result.data, query: kanji });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
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

function fetchJishoData(kanji) {
    const result = jisho.searchForKanji(kanji)
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
    return result.data
}

async function fetchTatoebaData(kanji) {
    const result = await axios.get(`https://api.tatoeba.org/v1/sentences?lang=jpn&q=${encodeURIComponent(kanji)}&word_count=-10&trans%3Alang=eng&sort=relevance&limit=20&include=transcriptions`)
    return result.data
}

app.get('/api/kanji/:character', async (req, res) => {
    const { character } = req.params;

    const [jisho, kanjiAlive, tatoeba] = await Promise.allSettled([
        fetchJishoData(character),
        fetchKanjiAliveData(character),
        fetchTatoebaData(character)
    ]);

    res.json({
        jisho: jisho.status === 'fulfilled' ? jisho.value : null,
        kanjiAlive: kanjiAlive.status === 'fulfilled' ? kanjiAlive.value : null,
        tatoeba: tatoeba.status === 'fulfilled' ? tatoeba.value : [],
        errorInSomeSource: [jisho, kanjiAlive, tatoeba].some(r => r.status === 'rejected')
    });
});

app.listen(port, () => {
    console.log(`Servidor Backend rodando em http://localhost:${port}`);
});