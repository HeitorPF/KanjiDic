const User = require('../models/User.js');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10

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

async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha atual incorreta.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Senha alterada com sucesso.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao alterar a senha.' });
    }
}

async function deleteAccount(req, res) {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        await User.findByIdAndDelete(req.userId);
        res.status(200).json({ message: 'Conta deletada com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar a conta.' });
    }
}

module.exports = { getPerfil, changePassword, deleteAccount };