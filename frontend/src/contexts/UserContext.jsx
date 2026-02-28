import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL

// 1. A ANTENA (O que você importa nos botões e formulários)
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

// 2. O SERVIDOR (O que você importa SÓ no App.jsx para abraçar o site todo)
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  function logout() {
    setUser(null);
    localStorage.removeItem('kanjidic_token');
  }

  async function carregarPerfil(token) {
    try {
      const resposta = await axios.get(`${VITE_API_URL}/api/perfil`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(resposta.data);
      console.log("Perfil carregado com sucesso!");
    // eslint-disable-next-line no-unused-vars
    } catch (erro) {
      console.error("Token inválido, deslogando...");
      logout();
    }
  }

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('kanjidic_token');
    if (tokenSalvo) {
      carregarPerfil(tokenSalvo);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, password) {
    const resposta = await axios.post(`${VITE_API_URL}/api/login`, { email, password });
    const token = resposta.data.token;
    localStorage.setItem('kanjidic_token', token);
    await carregarPerfil(token); 
  }

  // 3. A DISTRIBUIÇÃO
  // É aqui que empacotamos as variáveis e funções e mandamos para o resto do site!
  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}