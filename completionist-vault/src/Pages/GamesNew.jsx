import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import "./pages.css";
import gamesData from './gamesData'; // O arquivo foi importado como gamesData

function GamesNew() {
  // Estado para controlar a animação da barra de progresso após carregar a página
  const [animateProgress, setAnimateProgress] = useState(false);
  
  // Estado para controlar o filtro ativo
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Função auxiliar para definir a cor com base na porcentagem
  const getPctColor = (pct) => {
    if (pct === 100) return '#f5c518';
    if (pct >= 70) return '#4caf50';
    if (pct >= 40) return '#7c3aed';
    return '#555';
  };

  // Função para gerenciar o clique nos botões de filtro
  const handleFilterClick = (filterType) => {
    setActiveFilter(prevFilter => prevFilter === filterType ? null : filterType);
  };

  // Filtra a lista de jogos caso haja um filtro ativo
  const filteredGames = gamesData.filter(game => {
    if (activeFilter === 'recent') return game.recent;
    if (activeFilter === 'new') return game.isNew;
    return true;
  });

  return (
    <div className='page'>
      <Navbar />

      <div className='stats-bar'>
        <div className='stats-cards'>
          <span className='stats-label'>Achievements</span>
          <span className='stats-value'> 600 </span>
          <span className='stats-sub'>of 1.540</span>
        </div>
        <div className='stats-cards'>
          <span className='stats-label'>Time Played</span>
          <span className='stats-value'> 1.050h </span>
          <span className='stats-sub'>Last 4 months</span>
        </div>
        <div className='stats-cards'>
          <span className='stats-label'>100% Completed</span>
          <span className='stats-value'> 4 </span>
          <span className='stats-sub'>perfect games</span>
        </div>
      </div>

      <div className='page-header'>
        <h1 className='page-title'>My Library</h1>

        <p className='page-subtitle'>{gamesData.length} games in collection</p>
        
        <div className="filter-container">
          <button 
            className={`filter-btn ${activeFilter === 'recent' ? 'active' : ''}`}
            onClick={() => handleFilterClick('recent')}
          >
            Recentes
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'new' ? 'active' : ''}`}
            onClick={() => handleFilterClick('new')}
          >
            Novos
          </button>
        </div>
      </div>

      {/* Grid de jogos renderizado nativamente pelo React */}
      <div className="games-grid" id="games-grid">
        {filteredGames.map((g, index) => {
          const pctColor = getPctColor(g.pct);
          
          return (
            <div className='game-card' key={index}>
              <div className="game-cover-inner">
                <div className="game-cover-bg" style={{ background: `linear-gradient(160deg, ${g.color1}, ${g.color2})` }}>
                  <div className="cover-art">
                    <div style={{ fontSize: '56px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))', position: 'relative', zIndex: 2 }}>
                      {g.emoji}
                    </div>
                    <div className="cover-title-text" style={{ color: `${g.accent}aa` }}>
                      {g.name}
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 40%, ${g.accent}15, transparent 70%)` }}></div>
                  </div>
                </div>
                <div className="game-overlay">
                  <button className="play-btn">
                    <i className="ti ti-player-play" aria-hidden="true"></i>
                  </button>
                </div>
                {g.recent && <div className="recently-played-badge">Recente</div>}
                {g.isNew && <div className="new-badge">Novo</div>}
              </div>

              <div className="game-info">
                <div className="game-name">{g.name}</div>
                <div className="achievements-row">
                  <div className="achievements-label">
                    <i className="ti ti-trophy" style={{ color: pctColor }} aria-hidden="true"></i>
                    Achievements
                  </div>
                  <span className="achievements-count" style={{ color: pctColor }}>
                    {g.unlocked}/{g.total}
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: animateProgress ? `${g.pct}%` : '0%', 
                      background: pctColor,
                      transition: 'width 0.5s ease-out'
                    }}
                  ></div>
                </div>
                <div className="game-meta">
                  <span className="game-platform">{g.platform}</span>
                  <span className="game-hours">{g.hours}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GamesNew;