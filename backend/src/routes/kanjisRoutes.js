const express = require('express');
const router = express.Router();

const { getKanjis } = require('../controllers/kanjisController.js');

router.get('/kanjis', getKanjis);

module.exports = router;