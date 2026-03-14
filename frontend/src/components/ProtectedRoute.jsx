import { useNavigate, useOutlet } from 'react-router'

export function ProtectedRoute() {
  const navigate = useNavigate()
  const outlet = useOutlet()
  // Aqui você verifica se o usuário tem o token.
  // Neste exemplo, estou pegando direto do localStorage, mas 
  // você também poderia pegar de um AuthContext, se tiver um.
  const token = localStorage.getItem('kanjidic_token');

  // Se o token NÃO existir, manda o usuário de volta para a Home "/"
  // O "replace" é útil para o usuário não conseguir voltar para a 
  // rota bloqueada clicando no botão de "Voltar" do navegador.
  if (!token) {
    navigate('/', { replace: true })
    return null;
  }

  // Se o token existir, o <Outlet /> diz ao React Router: 
  // "Pode renderizar a página que o usuário estava tentando acessar!"
  return outlet;
}