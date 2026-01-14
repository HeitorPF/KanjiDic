const express = require('express');
const cors = require('cors');
const JishoAPI = require('unofficial-jisho-api');

const app = express();
const port = 3001;

app.use(cors());

const jisho = new JishoAPI();

app.get('/api/kanji/:character', async (req, res) => {
    const kanji = req.params.character;
    
    try {
        console.log(`Buscando kanji: ${kanji}`);
        const result = await jisho.searchForKanji(kanji);
        const result2 = await jisho.searchForExamples(kanji)
        result['examples'] = result2.results
        
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

app.listen(port, () => {
    console.log(`Servidor Backend rodando em http://localhost:${port}`);
});