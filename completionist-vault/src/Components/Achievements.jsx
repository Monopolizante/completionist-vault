import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Hook utilizado para capturar o ID dinâmico da rota
import axios from "axios";
import Navbar from "./Navbar";

import {
  IconDiamond,
  IconCircle,
  IconSparkleHighlight,
  IconCrown,
  IconCircleCheck,
  IconTrophy,
  IconLock,
  IconDeviceDesktop,
  IconCheck,
  IconAlertCircle
} from '@tabler/icons-react';

import "../Styles/Achievements.css";
import "../Styles/pages.css";

// Funçao das raridades (ajustas as classes pelo tipo e altera os icones)
function rarityLabel(r, globalPct) {
  const labels = { common: "Common", rare: "Rare", epic: "Epic", legendary: "Legendary" };
  return globalPct ? `${labels[r]} (${globalPct}%)` : labels[r] || r;
}
function rarityClass(r) {
  return { common: "rarity-common", rare: "rarity-rare", epic: "rarity-epic", legendary: "rarity-legendary" }[r] || "rarity-common";
}

// Retorna o componente do ícone correto do Tabler Icons com base na raridade
function renderRarityIcon(r) {
  const props = { size: 12, className: "rarity-icon-svg" };
  switch (r) {
    case "common": return <IconCircle {...props} />;
    case "rare": return <IconDiamond {...props} />;
    case "epic": return <IconSparkleHighlight {...props} />;
    case "legendary": return <IconCrown {...props} />;
    default: return <IconCircle {...props} />;
  }
}

function Achievements() {
  const { appId } = useParams(); // Resgata o ID do jogo da URL (/games/:appId/achievements)
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const carregarConquistasDoJogo = async () => {
      try {
        const portaAPI = 3000;

        // Busca as informações do usuário logado localmente para obter o ID da Steam
        const userInfo = await axios.get(`http://localhost:${portaAPI}/api/user`, { withCredentials: true });

        // Solicita as conquistas reais do jogo selecionado ao backend
        const response = await axios.get(`http://localhost:${portaAPI}/dados/user/jogos/${userInfo.data.id}/conquistas/${appId}`, { withCredentials: true });

        if (response.data) {
          setGameData(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.log("Erro na API de conquistas ou jogo sem suporte a conquistas.");
        setHasError(true);
        setLoading(false);
      }
    };

    carregarConquistasDoJogo();
  }, [appId]);

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <div className="sync-loading-text">Carregando Conquistas...</div>
      </div>
    );
  }

  // Se der erro ou o jogo explicitamente retornar 0 conquistas, renderiza a mensagem centralizada
  const total = gameData?.achievements?.length || 0;
  if (hasError || !gameData || total === 0) {
    return (
      <div className="page">
        <Navbar />
        <div className="no-achievements-container">
          <IconAlertCircle size={48} className="no-achievements-icon" />
          <h2>Este jogo não possui conquistas</h2>
          <p>Este título não possui suporte ao sistema de achievements da Steam ou as informações não estão disponíveis.</p>
        </div>
      </div>
    );
  }

  const unlockedCount = gameData?.achievements?.filter(a => a.unlocked).length || 0;
  const pct = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

  const legCount = gameData?.achievements?.filter(a => a.unlocked && a.rarity === "legendary").length || 0;
  const epicCount = gameData?.achievements?.filter(a => a.unlocked && a.rarity === "epic").length || 0;

  const filters = [
    { key: "all", label: "Todas", count: total },
    { key: "unlocked", label: "Desbloqueadas", count: unlockedCount },
    { key: "locked", label: "Bloqueadas", count: total - unlockedCount },
    { key: "legendary", label: "Lendárias", count: gameData?.achievements?.filter(a => a.rarity === "legendary").length || 0 },
    { key: "epic", label: "Épicas", count: gameData?.achievements?.filter(a => a.rarity === "epic").length || 0 },
  ];

  let filteredAchievements = gameData?.achievements || [];
  if (activeFilter === "unlocked") filteredAchievements = filteredAchievements.filter(a => a.unlocked);
  else if (activeFilter === "locked") filteredAchievements = filteredAchievements.filter(a => !a.unlocked);
  else if (["legendary", "epic", "rare", "common"].includes(activeFilter)) {
    filteredAchievements = filteredAchievements.filter(a => a.rarity === activeFilter);
  }

  const unlockedList = filteredAchievements.filter(a => a.unlocked);
  const lockedList = filteredAchievements.filter(a => !a.unlocked);

  return (
    <div className="page">
      <Navbar />
      {/* Hero Section */}
      <div className="game-hero" style={{ background: gameData.heroBg }}>
        <div className="game-hero-bg">
          <img src={gameData.imageIcon} alt="" className="hero-blur-bg" />
        </div>
        <div className="game-hero-overlay"></div>
        <div className="game-hero-content">
          <div className="game-info-left">
            <div className="game-cover-thumb">
              <img src={gameData.imageIcon} alt={gameData.name} className="game-cover-img" />
            </div>
            <div>
              <div className="game-title">{gameData.name}</div>
              <div className="game-platform-badge">
                <IconDeviceDesktop size={12} aria-hidden="true" />
                <span>{gameData.platform}</span>
              </div>
            </div>
          </div>
          <div className="game-stats-right">
            <div className="completion-pct">{pct}%</div>
            <div className="completion-label">Completo</div>
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="progress-section">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${pct}%`, background: gameData.accentColor }}
          ></div>
        </div>
        <div className="progress-meta">
          <span>{unlockedCount} de {total} conquistas</span>
          <span>{pct}% completo</span>
        </div>
      </div>

      {/* Card pequeno com stats */}
      <div className="stats-row">
        <div className="stat-mini">
          <div className="stat-mini-val">{unlockedCount}/{total}</div>
          <div className="stat-mini-label">Conquistas</div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-val color-legendary">{legCount}</div>
          <div className="stat-mini-label">Lendárias</div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-val color-epic">{epicCount}</div>
          <div className="stat-mini-label">Épicas</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters">
        {filters.map(f => (
          <button
            key={f.key}
            className={`filter-btn ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}<span className="filter-count">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Container dos achievements */}
      <div id="achievements-container">
        {unlockedList.length > 0 && (
          <div>
            <div className="section-title">
              <IconTrophy size={14} className="section-title-icon" aria-hidden="true" />
              {" "}Desbloqueadas · {unlockedList.length}
            </div>
            <div className="achievements-list">
              {unlockedList.map(a => <AchievementCard key={a.id} achievement={a} />)}
            </div>
          </div>
        )}

        {lockedList.length > 0 && (
          <div>
            <div className="section-title">
              <IconLock size={14} className="section-title-icon" aria-hidden="true" />
              {" "}Bloqueadas · {lockedList.length}
            </div>
            <div className="achievements-list">
              {lockedList.map(a => <AchievementCard key={a.id} achievement={a} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AchievementCard({ achievement: a }) {
  return (
    // Adiciona a classe de raridade no card para controlar o efeito de hover/glow
    <div className={`ach-card ${a.unlocked ? "" : "locked"} card-${a.rarity}`}>
      <div className="ach-card-inner">
        {/* Lado Esquerdo: Ícone centralizado à esquerda */}
        <div className={`ach-icon ${a.unlocked ? "ach-icon-unlocked" : "ach-icon-locked"}`}>
          {a.iconUrl ? (
            <img src={a.iconUrl} alt={a.name} className="ach-img" />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#2a2a2a', borderRadius: '4px' }} />
          )}

          {!a.unlocked && (
            <div className="lock-overlay">
              <IconLock size={10} className="lock-icon-svg" aria-hidden="true" />
            </div>
          )}
        </div>

        
        <div className="ach-body">
          {/* Nome com fonte um pouco maior */}
          <div className={`ach-name ${a.unlocked ? "" : "locked-text"}`}>{a.name}</div>
          {/* Descrição com fonte um pouco menor */}
          <div className="ach-desc">{a.desc}</div>
        </div>

        {/* Lado Direito: Raridade e data jogadas para a extremidade oposta */}
        <div className="ach-right">
          <span className={`ach-rarity ${rarityClass(a.rarity)}`}>
            {renderRarityIcon(a.rarity)}
            {" "}{rarityLabel(a.rarity, a.globalPercentage)}
          </span>
          <span className="ach-date">{a.unlocked ? a.date : "—"}</span>
        </div>
        {a.unlocked && (
          <div className="unlocked-check">
            <IconCheck size={11} className="check-icon-svg" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Achievements;