const mongoose = require('mongoose');

const kanjiSchema = new mongoose.Schema({
  kanji: {
    type: String,
    required: true,
    unique: true
  },
  grade: Number,
  jlpt: Number
});

module.exports = mongoose.model('Kanjis', kanjiSchema);