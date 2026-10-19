
import { useCallback, useEffect, useState } from 'react'
import './App.css'

interface Usuario {
  id: number
  nome: string
  idade: number
}

const API_URL = 'http://localhost:8080/api/v1/cadastrousuario'

function App() {
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [carregandoLista, setCarregandoLista] = useState(true)

  const carregarUsuarios = useCallback(async () => {
    setCarregandoLista(true)

    try {
      const resposta = await fetch(API_URL)
      if (!resposta.ok) throw new Error('Erro ao buscar usuários')

      const dados: Usuario[] = await resposta.json()
      setUsuarios(dados)
    } catch {
      setMensagem('Não foi possível carregar os usuários. Verifique a API.')
      setErro(true)
    } finally {
      setCarregandoLista(false)
    }
  }, [])

  useEffect(() => {
    carregarUsuarios()
  }, [carregarUsuarios])

  async function cadastrarUsuario(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setMensagem('')
    setCarregando(true)

    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          idade: Number(idade),
        }),
      })

      if (!resposta.ok) throw new Error('Erro ao cadastrar')

      const usuario: Usuario = await resposta.json()

      setNome('')
      setIdade('')
      setMensagem(`${usuario.nome} foi cadastrado com sucesso!`)
      setErro(false)
      await carregarUsuarios()
    } catch {
      setMensagem('Não foi possível cadastrar. Verifique a API.')
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="aplicacao">
      <header className="topo">
        <a className="marca" href="#" aria-label="UserFlow início">
          <span className="marca-icone">U</span>
          <span>UserFlow</span>
        </a>
        <span className="status-api">
          <span className="status-ponto" />
          Sistema de usuários
        </span>
      </header>

      <main className="conteudo">
        <section className="introducao">
          <span className="sobretitulo">PAINEL DE CONTROLE</span>
          <h1>Cadastro de usuários</h1>
          <p>Gerencie seus cadastros em um só lugar.</p>
        </section>

        <section className="resumo">
          <div className="resumo-icone">U</div>
          <div>
            <span className="resumo-legenda">Total de usuários</span>
            <strong className="resumo-numero">
              {carregandoLista ? '—' : usuarios.length}
            </strong>
          </div>
        </section>

        <div className="painel-grid">
          <section className="cartao">
            <div className="cartao-cabecalho">
              <div>
                <h2>Novo cadastro</h2>
                <p>Informe os dados abaixo para continuar.</p>
              </div>
              <span className="etiqueta">Cadastro</span>
            </div>

            <form onSubmit={cadastrarUsuario}>
              <div className="campo">
                <label htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Ex.: Maria Silva"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  maxLength={100}
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="idade">Idade</label>
                <input
                  id="idade"
                  type="number"
                  placeholder="Ex.: 25"
                  value={idade}
                  onChange={(event) => setIdade(event.target.value)}
                  min="1"
                  max="120"
                  required
                />
              </div>

              <button className="botao-principal" type="submit" disabled={carregando}>
                {carregando ? 'Salvando...' : '＋ Cadastrar usuário'}
              </button>
            </form>

            {mensagem && (
              <p className={`mensagem ${erro ? 'mensagem-erro' : ''}`} role="status">
                {mensagem}
              </p>
            )}
          </section>

          <section className="cartao cartao-lista">
            <div className="cartao-cabecalho">
              <div>
                <h2>Usuários cadastrados</h2>
                <p>Consulte os registros da sua base.</p>
              </div>
              <button
                className="botao-atualizar"
                type="button"
                onClick={carregarUsuarios}
                disabled={carregandoLista}
                aria-label="Atualizar lista de usuários"
                title="Atualizar lista"
              >
                ↻
              </button>
            </div>

            {carregandoLista ? (
              <p className="estado-lista">Carregando usuários...</p>
            ) : usuarios.length === 0 ? (
              <div className="estado-vazio">
                <span>◎</span>
                <strong>Nenhum usuário ainda</strong>
                <p>Cadastre o primeiro usuário pelo formulário.</p>
              </div>
            ) : (
              <div className="tabela-container">
                <table>
                  <thead>
                    <tr>
                      <th>Usuário</th>
                      <th>Idade</th>
                      <th>ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>
                          <div className="usuario-celula">
                            <span className="avatar">
                              {usuario.nome.trim().charAt(0).toUpperCase()}
                            </span>
                            <strong>{usuario.nome}</strong>
                          </div>
                        </td>
                        <td>{usuario.idade} anos</td>
                        <td>#{usuario.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="rodape-lista">
              {usuarios.length} {usuarios.length === 1 ? 'registro' : 'registros'}
            </div>
          </section>
        </div>

        <footer className="rodape">
          UserFlow · Projeto de estudo com React e Spring Boot
        </footer>
      </main>
    </div>
  )
}

export default App
