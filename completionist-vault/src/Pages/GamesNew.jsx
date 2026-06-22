import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import "../Styles/pages.css";
import "../Styles/Animation.css";
import "../Styles/Cards.css";
import gamesData from '../Scripts/gamesData';
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

  useEffect(() =>{
    const pegarDadosUsuario =  async () => {
        try{
            const portaAPI = 3000
            const userInfo = await axios.get(`http://localhost:${portaAPI}/api/user`, {withCredentials: true})
            const dados = await axios.get(`http://localhost:${portaAPI}/dados/user/jogos/${userInfo.data.id}`, {withCredentials: true})
            const dadosTeste = await axios.get(`http://localhost:${portaAPI}/dados/user/info?id=${userInfo.data.id}`, {withCredentials:true})
            console.log(dados)
            
            console.log(`Dados de informação do Usuário`)
            console.log(dados.data.infoUsuario)
            console.log("---------------------------")
            console.log("Array com todos os jogos do usuário")
            console.log(dados.data.jogosUsuario)

            
        }catch(err){
            console.log(err)
        }}
    pegarDadosUsuario()
}, [] )

  /* código pra fazer o map e puxar as imagens pra mandar pro componente
  {userData.map((jogo) => {
                const urlImagem = jogo.img_logo_url 
                    ? `https://media.steampowered.com/steamcommunity/public/images/apps/${jogo.appid}/${jogo.img_logo_url}.jpg`
                    : `https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/header.jpg`; // Fallback seguro
                console.log(urlImagem)
                return(
                    <GameCard game={jogo} key={jogo.appid} imagemJogo={urlImagem} />
                )
            })}
  */

  //Cores Baseado na porcentagem (40%, 70%, 100%)
  const getPctColor = (pct) => {
    if (pct === 100) return '#f5c518';
    if (pct >= 70) return '#22c97a';
    if (pct >= 40) return '#4e8cff';
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

          //Se o jogo esta 100% adicionar o brilho aura
          const isComplete = porcentagemReal === 100;

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