const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware.js');

const { login, register, getPerfil } = require('../controllers/authController.js');

router.post('/login', login);

router.post('/register', register)

router.get('/perfil', verifyToken, getPerfil)

module.exports = router;