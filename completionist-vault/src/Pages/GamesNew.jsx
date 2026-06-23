import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importado para permitir o redirecionamento dinâmico
import Navbar from '../Components/Navbar';
import StatsBar from '../Components/StatsBar';
import gamesData from '../Scripts/gamesData'; // Lista para quando esta deslogado

// Importando os ícones necessários do Tabler Icons
import {
  IconLockOpen,
  IconSearch,
  IconTrophy
} from '@tabler/icons-react';

import "../Styles/pages.css";
import "../Styles/Animation.css";
import "../Styles/Cards.css";
import "../Styles/LibraryOverlay.css";

function GamesNew() {
  const navigate = useNavigate();
  const [animateProgress, setAnimateProgress] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Controla o que exibe (Logado/Deslogado)
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const pegarDadosUsuario = async () => {
      try {
        const portaAPI = 3000;
        // Tenta buscar dados do usuário autenticado
        const userInfo = await axios.get(`http://localhost:${portaAPI}/api/user`, { withCredentials: true });
        const dados = await axios.get(`http://localhost:${portaAPI}/dados/user/jogos/${userInfo.data.id}`, { withCredentials: true });

        if (dados.data.jogosUsuario?.response?.games) {
          setGames(dados.data.jogosUsuario.response.games);
          setIsLoggedIn(true);
        }

        setLoading(false);
      } catch (err) {
        console.log("Usuário deslogado ou erro na API, carregando demonstração.");
        setGames(gamesData);
        setIsLoggedIn(false);
        setLoading(false);
      }
    };
    pegarDadosUsuario();
  }, []);

  // Redireciona para o fluxo de autenticação da Steam
  const handleRedirectLogin = () => {
    window.location.href = "http://localhost:3000/auth/steam";
  };

  //Cores Baseado na porcentagem (40%, 70%, 100%)
  const getPctColor = (pct) => {
    if (pct === 100) return '#f5c518';
    if (pct >= 70) return '#22c97a';
    if (pct >= 40) return '#4e8cff';
    return '#555';
  };

  const handleFilterClick = (filterType) => {
    if (!isLoggedIn) return; // Trava filtros no modo deslogado
    setActiveFilter(prevFilter => prevFilter === filterType ? null : filterType);
  };

  // Filtra os jogos baseado no filtro selecionado E na barra de pesquisa (se estiver logado)
  const filteredGames = games.filter(game => {
    // Se estiver logado, valida a busca por nome
    if (isLoggedIn && searchQuery.trim() !== '') {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }

    if (!isLoggedIn) return true; // Mostra todos do mock sem filtro se deslogado
    if (activeFilter === 'recent') return game.playtime_2weeks > 0;
    return true;
  });

  
  const handleGameClick = (game) => {
    const idJogo = isLoggedIn ? game.appid : (game.id || game.appid);
    navigate(`/games/${idJogo}/achievements`);
  };

  // Só mostra tela de loading genérica enquanto a API (luta pela vida) de login original responde
  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <div className="sync-loading-text">
          Sincronizando Biblioteca...
        </div>
      </div>
    );
  }

  return (
    <div className='page'>
      <Navbar />

      {/* Classe para o Blur (se deslogado) */}
      <div className="protected-library-wrapper">

        {/* Camada superior com mensagem de bloqueio (Só renderiza se deslogado) */}
        {!isLoggedIn && (
          <div className="library-login-overlay">
            <div className="login-callout-card">
              <IconLockOpen size={24} className="lock-open-icon" />
              <h2>Biblioteca Trancada</h2>
              <p>Conecte sua conta da Steam para sincronizar automaticamente seus jogos, horas jogadas e progressos de conquistas em tempo real.</p>
              <button className="overlay-connect-btn" onClick={handleRedirectLogin}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="steam-btn-svg">
                  <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.662 0 3.015-1.35 3.015-3.015zm-5.273.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z" />
                </svg>
                Sign in with Steam
              </button>
            </div>
          </div>
        )}

        {/* Todo o resto da interface recebe desfoque caso esteja deslogado */}
        <div className={!isLoggedIn ? "blur-content" : ""}>

          <StatsBar games={games} />

          <div className='page-header'>
            <h1 className='page-title'>My Library</h1>
            <p className='page-subtitle'>{games.length} games in collection</p>

            {/* Container unificado com Filtros e Barra de Pesquisa */}
            <div className="controls-container">
              <div className="filter-container">
                <button
                  className={`filter-btn ${activeFilter === 'recent' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('recent')}
                >
                  Recentes
                </button>
              </div>

              {/* Barra de pesquisa - Só fica funcional e visível se o usuário estiver logado aura */}
              {isLoggedIn && (
                <div className="search-wrapper">
                  <IconSearch size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar jogo pelo nome..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="games-grid" id="games-grid">
            {filteredGames.map((g, index) => {

              const nomeJogo = g.name;

              // código pra fazer o map e puxar as imagens pra mandar pro componente 
              const urlImagem = isLoggedIn
                ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${g.appid}/header.jpg`
                : g.image; // Do arquivo mock local

              const horasJogadas = isLoggedIn
                ? (g.playtime_forever ? `${(g.playtime_forever / 60).toFixed(1)}h` : '0h')
                : g.hours; // Do arquivo mock local

              // Calcular porcentagem se tiver conquistas (Conectado dinamicamente com os dados reais mapeados do seu backend)
              const porcentagemReal = isLoggedIn 
                ? (g.has_achievements ? g.pct : 0) 
                : g.pct; // Puxa do local se deslogado
                
              const conquistasTexto = isLoggedIn
                ? (g.has_achievements ? `${g.unlocked}/${g.total}` : "0/0")
                : `${g.unlocked}/${g.total}`; // Puxa do local se deslogado

              const isRecent = isLoggedIn ? (g.playtime_2weeks > 0) : g.recent;

              // Pega a cor da barra baseado na pporcentagem
              const pctColor = getPctColor(porcentagemReal);

              //Se o jogo esta 100% adicionar o brilho aura
              const isComplete = porcentagemReal === 100;

              return (
                <div
                  className='game-card'
                  key={isLoggedIn ? g.appid : index}
                  onClick={() => handleGameClick(g)} // Evento adicionado para capturar cliques
                  style={{ cursor: 'pointer' }}
                >
                  <div className="game-cover-inner">
                    <div
                      className="game-cover-bg"
                      style={{
                        backgroundImage: `url(${urlImagem})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '100%',
                        width: '100%'
                      }}
                    ></div>
                    <div className="game-overlay"></div>
                    {isRecent && <div className="recently-played-badge">Recente</div>}
                  </div>

                  <div className="game-info">
                    <div className="game-name">{nomeJogo}</div>
                    <div className="achievements-row">
                      <div className="achievements-label">
                        <IconTrophy size={14} style={{ color: pctColor }} />
                        Achievements
                      </div>
                      {/* Mostra o número de conquistas */}
                      <span className="achievements-count" style={{ color: pctColor }}>
                        {conquistasTexto} ({porcentagemReal}%)
                      </span>
                    </div>

                    <div className="progress-bar-bg">
                      <div
                        //Cria a classe 'progress-shimmer' se o jogo for platinado (100%)
                        className={`progress-bar-fill ${isComplete ? 'progress-shimmer' : ''}`}
                        style={{
                          // Pega a porcentagem Calculado(se n quebrar), senão começa no 0%
                          width: animateProgress ? `${porcentagemReal}%` : '0%',
                          backgroundColor: pctColor,
                          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' // Tansição 'So fresh, so clean'
                        }}
                      ></div>
                    </div>

                    <div className="game-meta">
                      <span className="game-platform">{isLoggedIn ? "Steam" : g.platform}</span>
                      <span className="game-hours">{horasJogadas}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default GamesNew;