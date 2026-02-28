const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email não encontrado' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.status(200).json({
      token: token
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function register(req, res) {
  const { name, email, password } = req.body;
  if (await User.findOne({ email: email })) {
    res.status(400).json({ message: 'email já cadastrado' })
  }
  else {
    const pwcrypt = await bcrypt.hash(password, SALT_ROUNDS)
    const user = new User({ name, email, password: pwcrypt })
    await user.save()
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.status(200).json({
      token: token
    });
  }
}

async function getPerfil(req, res){
    try {
        //busca dados do usuário no banco de dados, sem a senha
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o perfil do usuário.' });
    }
}

module.exports = { login, register, getPerfil };