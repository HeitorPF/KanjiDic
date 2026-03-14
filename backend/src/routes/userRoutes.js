const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware.js');

const{getPerfil, changePassword, deleteAccount} = require('../controllers/userController.js');

router.get('/perfil', verifyToken, getPerfil)

router.patch('/changePassword', verifyToken, changePassword)

router.delete('/deleteAccount', verifyToken, deleteAccount)

module.exports = router;