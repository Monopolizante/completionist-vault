import { useState } from "react";
import "../Styles/Achievements.css";
import "../Styles/pages.css";
import Navbar from "./Navbar";

const GAME_DATA = {
  name: "Resident Evil 9: Requiem",
  imageIcon: "src/Images/Re9.jpg", 
  heroBg: "linear-gradient(160deg, #0a1118, #16241a)",
  accentColor: "#3ba358",
  platform: "PC",
  totalHours: "28h",
  achievements: [
    { 
      id: 1, 
      name: "Agente Notavel", 
      desc: "Conclua a história principal no modo insano", 
      iconUrl: "src/Images/Achievements/AgenteNotavel.png", 
      rarity: "legendary",
      unlocked: true, 
      date: "20 jun 2026" 
    },
    { 
      id: 2, 
      name: "Agente Casca-Grossa", 
      desc: "Conclua a história principal pelo menos no modo Padrão(Clássico).", 
      iconUrl: "src/Images/Achievements/AgenteCasca.png", 
      rarity: "rare",
      unlocked: false, 
      date: "21 jun 2026" 
    },
    { 
      id: 3, 
      name: "Detox Raiz", 
      desc: "Conclua a história principal sem usar ervas ou injetores vitais.", 
      iconUrl: "src/Images/Achievements/DetoxRaiz.png", 
      rarity: "legendary",
      unlocked: true, 
      date: "22 jun 2026" 
    },
    { 
      id: 4, 
      name: "Noite sem fim", 
      desc: "Chegue ao pátio do centro de cuidados.", 
      iconUrl: "src/Images/Achievements/NoiteSemFim.png", 
      rarity: "common", 
      unlocked: true, 
      date: null 
    },
    { 
      id: 5, 
      name: "Excelente custo-benefício", 
      desc: "Derrote pelo menos três inimigos com um único tiro de Requiem.", 
      iconUrl: "src/Images/Achievements/CustoBeneficio.png", 
      rarity: "epic", 
      unlocked: true, 
      date: null 
    },
    { 
      id: 6, 
      name: "Demônio da Velocidade", 
      desc: "Conclua a história principal libertando Elpis em até quatro horas.", 
      iconUrl: "src/Images/Achievements/DemonioDaVelocidade.png", 
      rarity: "legendary",
      unlocked: true, 
      date: null 
    }
  ]
};

// Funçao das raridades (ajustas as classes pelo tipo e altera os icones(Ainda falta configura))
function rarityLabel(r) {
  return { common: "Common", rare: "Rare", epic: "Epic", legendary: "Legendary" }[r] || r;
}
function rarityClass(r) {
  return { common: "rarity-common", rare: "rarity-rare", epic: "rarity-epic", legendary: "rarity-legendary" }[r] || "rarity-common";
}
function rarityIcon(r) {
  return { common: "ti-circle", rare: "ti-diamond", epic: "ti-star", legendary: "ti-crown" }[r] || "ti-circle";
}

function Achievements() {
  const [activeFilter, setActiveFilter] = useState("all");

  const total = GAME_DATA.achievements.length;
  const unlockedCount = GAME_DATA.achievements.filter(a => a.unlocked).length;
  const pct = Math.round((unlockedCount / total) * 100);
  
  const legCount = GAME_DATA.achievements.filter(a => a.unlocked && a.rarity === "legendary").length;
  const epicCount = GAME_DATA.achievements.filter(a => a.unlocked && a.rarity === "epic").length;

  const filters = [
    { key: "all", label: "Todas", count: total },
    { key: "unlocked", label: "Desbloqueadas", count: unlockedCount },
    { key: "locked", label: "Bloqueadas", count: total - unlockedCount },
    { key: "legendary", label: "Lendárias", count: GAME_DATA.achievements.filter(a => a.rarity === "legendary").length },
    { key: "epic", label: "Épicas", count: GAME_DATA.achievements.filter(a => a.rarity === "epic").length },
  ];

  let filteredAchievements = GAME_DATA.achievements;
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
      <div className="game-hero" style={{ background: GAME_DATA.heroBg }}>
        <div className="game-hero-bg">
          <img src={GAME_DATA.imageIcon} alt="" className="hero-blur-bg" style={{ opacity: 0.15, width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} />
        </div>
        <div className="game-hero-overlay"></div>
        <div className="game-hero-content">
          <div className="game-info-left">
            <div className="game-cover-thumb" style={{ background: "transparent" }}>
              <img src={GAME_DATA.imageIcon} alt={GAME_DATA.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
            </div>
            <div>
              <div className="game-title">{GAME_DATA.name}</div>
              <div className="game-platform-badge">
                <i className="ti ti-device-desktop" style={{ fontSize: "12px" }} aria-hidden="true"></i>
                <span>{GAME_DATA.platform}</span>
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
            style={{ width: `${pct}%`, background: GAME_DATA.accentColor }}
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
          <div className="stat-mini-val" style={{ color: "var(--rarity-legendary)" }}>{legCount}</div>
          <div className="stat-mini-label">Lendárias</div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-val" style={{ color: "var(--rarity-epic)" }}>{epicCount}</div>
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
              <i className="ti ti-trophy" style={{ fontSize: "14px", color: "var(--text-disabled)" }} aria-hidden="true"></i> 
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
              <i className="ti ti-lock" style={{ fontSize: "14px", color: "var(--text-disabled)" }} aria-hidden="true"></i> 
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
    // Adicionamos a classe de raridade diretamente no card para controlar o efeito de hover/glow
    <div className={`ach-card ${a.unlocked ? "" : "locked"} card-${a.rarity}`}>
      <div className={`ach-icon ${a.unlocked ? "ach-icon-unlocked" : "ach-icon-locked"}`}>
        <img src={a.iconUrl} alt={a.name} className="ach-img" />
        
        {!a.unlocked && (
          <div className="lock-overlay">
            <i className="ti ti-lock" style={{ fontSize: "10px", color: "var(--text-muted)" }} aria-hidden="true"></i>
          </div>
        )}
      </div>
      <div className="ach-body">
        <div className={`ach-name ${a.unlocked ? "" : "locked-text"}`}>{a.name}</div>
        {/* CORREÇÃO AQUI: Agora a.desc aparece sempre, independente de estar desbloqueado ou não */}
        <div className="ach-desc">{a.desc}</div>
      </div>
      <div className="ach-right">
        <span className={`ach-rarity ${rarityClass(a.rarity)}`}>
          <i className={`ti ${rarityIcon(a.rarity)}`} style={{ fontSize: "10px" }} aria-hidden="true"></i>
          {" "}{rarityLabel(a.rarity)}
        </span>
        <span className="ach-date">{a.unlocked ? a.date : "—"}</span>
      </div>
      {a.unlocked && (
        <div className="unlocked-check">
          <i className="ti ti-check" style={{ fontSize: "11px", color: "var(--color-progress)" }} aria-hidden="true"></i>
        </div>
      )}
    </div>
  );
}

export default Achievements;