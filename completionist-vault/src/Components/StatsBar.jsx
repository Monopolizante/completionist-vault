import "../Styles/CompStyle.css";
import gamesData from '../Scripts/gamesData';

// Puxar lista dos jogos(API version) 
function StatsBar({ games }) {
  
  //Calculo total de platina (Adaptado para não quebrar tudo enquanto não há dados de conquistas da API osss)
  const totalPlatinados = games.filter(g => g.total > 0 && g.unlocked === g.total).length;

  //Cálculo de conquistas totais 
  const totalUnlocked = games.reduce((acc, g) => acc + (g.unlocked || 0), 0);
  const totalAchievementsPossiveis = games.reduce((acc, g) => acc + (g.total || 0), 0);

  //Cálculo de horas totais
  const totalHoras = games.reduce((acc, g) => {
    // Ajeita o 'playtime_forever' que API envia em minutos, converte para horas dividindo por 60
    const horasNumero = g.playtime_forever ? Math.floor(g.playtime_forever / 60) : 0;
    return acc + horasNumero;
  }, 0);

  return (
    <div className='stats-bar'>
      <div className='stats-cards'>
        <span className='stats-label'>Achievements</span>
        <span className='stats-value'> {totalUnlocked.toLocaleString()} </span>
        <span className='stats-sub'>of {totalAchievementsPossiveis.toLocaleString()}</span>
      </div>
      
      <div className='stats-cards'>
        <span className='stats-label'>Time Played</span>
        <span className='stats-value'> {totalHoras.toLocaleString()}h </span>
        <span className='stats-sub'>Total library time</span>
      </div>
      
      <div className='stats-cards'>
        <span className='stats-label'>100% Completed</span>
        <span className='stats-value'> {totalPlatinados} </span>
        <span className='stats-sub'>
          {totalPlatinados === 1 ? 'perfect game' : 'perfect games'}
        </span>
      </div>
    </div>
  );
}

export default StatsBar;