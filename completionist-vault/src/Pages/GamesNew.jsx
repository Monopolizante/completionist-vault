import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import "./pages.css";
import gamesData from './gamesData';
import StatsBar from '../Components/StatsBar';
function GamesNew() {

  const [animateProgress, setAnimateProgress] = useState(false);


  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  //Cores Baseado na porcentagem (40%, 70%, 100%)
  const getPctColor = (pct) => {
    if (pct === 100) return '#f5a623';
    if (pct >= 70) return '#22c97a';
    if (pct >= 40) return '#f04040';
    return '#555';
  };


  const handleFilterClick = (filterType) => {
    setActiveFilter(prevFilter => prevFilter === filterType ? null : filterType);
  };


  const filteredGames = gamesData.filter(game => {
    if (activeFilter === 'recent') return game.recent;
    if (activeFilter === 'new') return game.isNew;
    return true;
  });


  return (
    <div className='page'>
      <Navbar />
      <StatsBar games={gamesData} />

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


      <div className="games-grid" id="games-grid">
        {filteredGames.map((g, index) => {

          // Calcular porcentagem se tiver conquistas
          const porcentagemReal = g.total > 0 ? Math.round((g.unlocked / g.total) * 100) : 0;

          // Pega a cor da barra baseado na pporcentagem
          const pctColor = getPctColor(porcentagemReal);

          return (
            <div className='game-card' key={index}>
              <div className="game-cover-inner">
                <div
                  className="game-cover-bg"
                  style={{
                    backgroundImage: `url(${g.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100%',
                    width: '100%'
                  }}
                ></div>

                <div className="game-overlay">
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
                  {/* Mostra o número de conquistas */}
                  <span className="achievements-count" style={{ color: pctColor }}>
                    {g.unlocked}/{g.total} ({porcentagemReal}%)
                  </span>
                </div>

                <div className="progress-bar-bg">

                  <div
                    className="progress-bar-fill"
                    style={{
                      // Mostra a porcentagem Calculado, senão começa no 0%
                      width: animateProgress ? `${porcentagemReal}%` : '0%',
                      background: pctColor,
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' // Tansição 'So fresh, so clean'
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