import { useState, useEffect } from 'react'
import './App.css'
import './Controle.css'

const API_BASE = 'http://localhost:5000/api/torneio'

function App() {
  const [categoria, setCategoria] = useState('CATEGORIA DO TORNEIO')
  const [jogos, setJogos] = useState([])
  const [novoJogo, setNovoJogo] = useState({ dupla1: '', dupla2: '' })
  const [modoControle, setModoControle] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarStatus()
  }, [])

  useEffect(() => {
    if (!modoControle) {
      const interval = setInterval(() => {
        carregarStatus()
      }, 30000)
      carregarStatus()
      return () => clearInterval(interval)
    }
  }, [modoControle])

  const carregarStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/status`)
      const data = await response.json()
      if (data.success) {
        setCategoria(data.data.categoria)
        setJogos(data.data.jogos_exibicao || [])
      }
    } catch (error) {
      console.error('Erro ao carregar status:', error)
      const jogosIniciais = [
        { id: 1, dupla1: 'João/Pedro', dupla2: 'Carlos/Ana' },
        { id: 2, dupla1: 'Maria/José', dupla2: 'Lucas/Sofia' },
        { id: 3, dupla1: 'Bruno/Rita', dupla2: 'Diego/Carla' },
        { id: 4, dupla1: 'Felipe/Laura', dupla2: 'Marcos/Julia' },
        { id: 5, dupla1: 'André/Beatriz', dupla2: 'Rafael/Camila' },
        { id: 6, dupla1: 'Gabriel/Fernanda', dupla2: 'Thiago/Patrícia' }
      ]
      setJogos(jogosIniciais)
    } finally {
      setLoading(false)
    }
  }

  const atualizarCategoria = async (novaCategoria) => {
    try {
      const response = await fetch(`${API_BASE}/categoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoria: novaCategoria })
      })
      const data = await response.json()
      if (data.success) setCategoria(novaCategoria)
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      setCategoria(novaCategoria)
    }
  }

  const adicionarJogo = async () => {
    if (novoJogo.dupla1.trim() && novoJogo.dupla2.trim()) {
      try {
        const response = await fetch(`${API_BASE}/jogos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dupla1: novoJogo.dupla1.trim(),
            dupla2: novoJogo.dupla2.trim()
          })
        })
        const data = await response.json()
        if (data.success) {
          setNovoJogo({ dupla1: '', dupla2: '' })
          await carregarStatus()
        }
      } catch (error) {
        console.error('Erro ao adicionar jogo:', error)
        const novoId = Math.max(...jogos.map(j => j.id), 0) + 1
        setJogos([...jogos, { id: novoId, dupla1: novoJogo.dupla1.trim(), dupla2: novoJogo.dupla2.trim() }])
        setNovoJogo({ dupla1: '', dupla2: '' })
      }
    }
  }

  const iniciarProximoJogo = async () => {
    try {
      const response = await fetch(`${API_BASE}/jogos/iniciar-proximo`, { method: 'POST' })
      const data = await response.json()
      if (data.success) await carregarStatus()
    } catch (error) {
      console.error('Erro ao iniciar próximo jogo:', error)
      if (jogos.length > 0) setJogos(jogos.slice(1))
    }
  }

  const removerJogo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/jogos/${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) await carregarStatus()
    } catch (error) {
      console.error('Erro ao remover jogo:', error)
      setJogos(jogos.filter(jogo => jogo.id !== id))
    }
  }

  const handleCategoriaChange = (e) => {
    const novaCategoria = e.target.value
    setCategoria(novaCategoria)
    atualizarCategoria(novaCategoria)
  }

  if (!modoControle) {
    // Modo de exibição para TV
    return (
      <div className="tv-display">
        <div className="tv-container">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="tv-title">{categoria}</h1>
            <span className="badge bg-secondary tv-badge">
              Próximas Partidas
            </span>
          </div>

          {/* Grid de Jogos */}
          {loading ? (
            <div className="loading-text">
              Carregando jogos...
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-1 g-4">
              {jogos.slice(0, 6).map((jogo, index) => (
                <div className="col" key={jogo.id}>
                  {index === 0 ? (
                    <div className="card game-card">
                      <div className="card-header pb-3">
                        <h5 className="card-title game-card-title">
                          PRÓXIMO JOGO
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="text-center" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem'}}>
                          <span className="team-blue team-name" style={{fontSize: '1.5rem', minWidth: '180px', textAlign: 'center'}}>
                            {jogo.dupla1}
                          </span>
                          <span className="vs-text" style={{fontSize: '2rem'}}>x</span>
                          <span className="team-red team-name" style={{fontSize: '1.5rem', minWidth: '180px', textAlign: 'center'}}>
                            {jogo.dupla2}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="game-card-small">
                      <span className="team-blue-small">{jogo.dupla1}</span>
                      <span className="vs-text-small">x</span>
                      <span className="team-red-small">{jogo.dupla2}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Botão para alternar para modo controle */}
          <div className="control-button-container">
            <button 
              onClick={() => setModoControle(true)}
              className="btn btn-light control-button"
            >
              Modo Controle
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Modo de controle com classes do Controle.css
  return (
    <div className="controle-container">
      <div className="controle-title">Controle do Torneio</div>
      <div className="controle-top-buttons">
        <button 
          onClick={carregarStatus}
          className="controle-btn controle-btn-secondary"
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
        <button 
          onClick={() => setModoControle(false)}
          className="controle-btn controle-btn-primary"
        >
          Modo Exibição
        </button>
      </div>

      <div className="controle-card">
        <label className="controle-label">Categoria do Torneio</label>
        <input
          type="text"
          value={categoria}
          onChange={handleCategoriaChange}
          placeholder="Digite a categoria do torneio"
          className="controle-input"
        />
      </div>

      <div className="controle-card">
        <label className="controle-label">Adicionar Novo Jogo</label>
        <input
          type="text"
          value={novoJogo.dupla1}
          onChange={(e) => setNovoJogo({...novoJogo, dupla1: e.target.value})}
          placeholder="Dupla 1 (Ex: João/Pedro)"
          className="controle-input"
        />
        <input
          type="text"
          value={novoJogo.dupla2}
          onChange={(e) => setNovoJogo({...novoJogo, dupla2: e.target.value})}
          placeholder="Dupla 2 (Ex: Carlos/Ana)"
          className="controle-input"
        />
        <button 
          onClick={adicionarJogo} 
          className="controle-btn-success"
          disabled={loading}
        >
          Adicionar Jogo
        </button>
      </div>

      <div className="controle-card controle-controles">
        <div className="controle-controles-info">
          Próximo jogo: {jogos.length > 0 ? `${jogos[0]?.dupla1} vs ${jogos[0]?.dupla2}` : 'Nenhum jogo na fila'}
        </div>
        <button 
          onClick={iniciarProximoJogo}
          disabled={jogos.length === 0 || loading}
          className="controle-btn-iniciar"
        >
          Iniciar Próximo Jogo
        </button>
        <div className="controle-controles-info" style={{marginTop: '10px'}}>
          Jogos sendo exibidos: {jogos.length}
        </div>
      </div>

      <div className="controle-card">
        <label className="controle-label">Jogos em Exibição</label>
        <div className="controle-jogos-list">
          {jogos.map((jogo, index) => (
            <div key={jogo.id} className="controle-jogo-item">
              <div className="controle-jogo-info">
                <span className="controle-jogo-badge">
                  Jogo {index + 1}
                </span>
                <span className="controle-jogo-nome">
                  {jogo.dupla1} <span style={{color: '#888'}}>vs</span> {jogo.dupla2}
                </span>
              </div>
              <button
                onClick={() => removerJogo(jogo.id)}
                className="controle-jogo-remove"
                disabled={loading}
                title="Remover jogo"
              >
                &#x2716;
              </button>
            </div>
          ))}
          {jogos.length === 0 && (
            <div className="controle-controles-info" style={{textAlign: 'center', marginTop: '16px'}}>
              Nenhum jogo na fila
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
