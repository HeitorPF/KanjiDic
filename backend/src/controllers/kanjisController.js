const Kanjis = require('../models/Kanjis');

async function getKanjis(req, res) {
  try {
    const { grade, jlpt } = req.query;
    const filtro = {};

    if (grade) {
      filtro.grade = Number(grade);
    }

    if (jlpt) {
      filtro.jlpt = Number(jlpt);
    }
    const kanjis = await Kanjis.find(filtro);
    res.status(200).json(kanjis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar os kanjis' });
  }
}

module.exports = {
  getKanjis
};