import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importado para permitir o redirecionamento dinâmico
import Navbar from '../Components/Navbar';
import gamesData from '../Scripts/gamesData'; // Lista para quando esta deslogado
import { useCategories } from '../contexts/CategoriesContext';

// Importando os ícones necessários do Tabler Icons
import {
  IconEdit,
  IconFolderPlus,
  IconLockOpen,
  IconPlus,
  IconSearch,
  IconTrash,
  IconTrophy,
  IconX
} from '@tabler/icons-react';

import "../Styles/pages.css";
import "../Styles/Animation.css";
import "../Styles/Cards.css";
import "../Styles/LibraryOverlay.css";
import "../Styles/Categories.css";

function GamesNew() {
  const navigate = useNavigate();
  const [animateProgress, setAnimateProgress] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Controla o que exibe (Logado/Deslogado)
  const [searchQuery, setSearchQuery] = useState('');

  // Estados do CRUD de categorias
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [feedback, setFeedback] = useState('');

  const {
    categories,
    categoriesLoading,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    addGameToCategory,
    removeGameFromCategory,
  } = useCategories();

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
        console.log(dados)
        if (dados.data.jogosUsuario?.response?.games) {
          setGames(dados.data.jogosUsuario.response.games);
          setIsLoggedIn(true);
          await loadCategories();
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
  }, [loadCategories]);

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

  const handleCreateCategory = async (event) => {
    event.preventDefault();

    if (!categoryName.trim()) {
      setFeedback('Digite um nome para a categoria.');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: categoryName.trim(),
          description: categoryDescription.trim(),
        });
        setFeedback('Categoria atualizada com sucesso.');
      } else {
        await createCategory({
          name: categoryName.trim(),
          description: categoryDescription.trim(),
        });
        setFeedback('Categoria criada com sucesso.');
      }

      setCategoryName('');
      setCategoryDescription('');
      setEditingCategory(null);
      setShowCategoryForm(false);
    } catch (error) {
      setFeedback(error.response?.data?.error || 'Não foi possível criar a categoria.');
    }
  };


  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDescription('');
    setShowCategoryForm(true);
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm('Deseja apagar esta categoria e todos os vínculos de jogos?');
    if (!confirmed) return;

    try {
      await deleteCategory(categoryId);
      setFeedback('Categoria apagada com sucesso.');
    } catch (error) {
      setFeedback(error.response?.data?.error || 'Não foi possível apagar a categoria.');
    }
  };

  const openAddGameModal = (event, game) => {
    event.stopPropagation();
    setSelectedGame(game);
    setShowAddGameModal(true);
    setFeedback('');
  };

  const handleAddGame = async (categoryId) => {
    if (!selectedGame) return;

    try {
      await addGameToCategory(categoryId, selectedGame);
      setFeedback(`${selectedGame.name} foi adicionado à categoria.`);
      setShowAddGameModal(false);
    } catch (error) {
      setFeedback(error.response?.data?.error || 'Não foi possível adicionar o jogo.');
    }
  };

  const handleRemoveGame = async (event, categoryId, appid) => {
    event.stopPropagation();

    try {
      await removeGameFromCategory(categoryId, appid);
      setFeedback('Jogo removido da categoria.');
    } catch (error) {
      setFeedback(error.response?.data?.error || 'Não foi possível remover o jogo.');
    }
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
          <div className='page-header'>
            <div className="library-title-row">
              <div>
                <h1 className='page-title'>My Library</h1>
                <p className='page-subtitle'>{games.length} games in collection</p>
              </div>

              {isLoggedIn && (
                <button
                  className="create-category-btn"
                  onClick={openCreateCategory}
                >
                  <IconFolderPlus size={18} />
                  Criar categoria
                </button>
              )}
            </div>

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

          {feedback && <div className="category-feedback">{feedback}</div>}

          {isLoggedIn && (
            <section className="categories-section">
              <div className="categories-heading">
                <div>
                  <span>Organização do Vault</span>
                  <h2>Suas categorias</h2>
                </div>
                <strong>{categories.length}</strong>
              </div>

              {categoriesLoading ? (
                <p className="category-empty">Carregando categorias...</p>
              ) : categories.length === 0 ? (
                <p className="category-empty">Nenhuma categoria criada ainda. O cofre está ecoando.</p>
              ) : (
                <div className="categories-grid">
                  {categories.map((category) => (
                    <article className="category-card" key={category.id}>
                      <div className="category-card-header">
                        <div>
                          <h3>{category.name}</h3>
                          <p>{category.description || 'Sem descrição'}</p>
                        </div>
                        <div className="category-card-actions">
                          <button
                            className="category-edit-btn"
                            onClick={() => openEditCategory(category)}
                            title="Editar categoria"
                          >
                            <IconEdit size={17} />
                          </button>
                          <button
                            className="category-delete-btn"
                            onClick={() => handleDeleteCategory(category.id)}
                            title="Apagar categoria"
                          >
                            <IconTrash size={17} />
                          </button>
                        </div>
                      </div>

                      <div className="category-games-list">
                        {(category.games || []).length === 0 ? (
                          <span className="category-empty-small">Nenhum jogo nesta categoria.</span>
                        ) : (
                          category.games.map((categoryGame) => (
                            <div className="category-game-chip" key={`${category.id}-${categoryGame.appid}`}>
                              <span>{categoryGame.game_name || `App ${categoryGame.appid}`}</span>
                              <button
                                onClick={(event) => handleRemoveGame(event, category.id, categoryGame.appid)}
                                title="Remover jogo da categoria"
                              >
                                <IconX size={14} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

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
                    {isLoggedIn && (
                      <button
                        className="add-game-category-btn"
                        onClick={(event) => openAddGameModal(event, g)}
                        title="Adicionar jogo a uma categoria"
                      >
                        <IconPlus size={17} />
                      </button>
                    )}
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

      {showCategoryForm && (
        <div className="category-modal-backdrop" onClick={() => { setShowCategoryForm(false); setEditingCategory(null); }}>
          <form className="category-modal" onSubmit={handleCreateCategory} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close-btn" onClick={() => setShowCategoryForm(false)}>
              <IconX size={20} />
            </button>
            <span>{editingCategory ? 'Editar entidade' : 'Nova entidade'}</span>
            <h2>{editingCategory ? 'Editar categoria' : 'Criar categoria'}</h2>
            <label>
              Nome
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                maxLength={100}
                placeholder="Ex.: Quero completar"
              />
            </label>
            <label>
              Descrição
              <textarea
                value={categoryDescription}
                onChange={(event) => setCategoryDescription(event.target.value)}
                maxLength={255}
                placeholder="Uma pequena descrição para a categoria"
              />
            </label>
            <button className="modal-primary-btn" type="submit">{editingCategory ? 'Atualizar categoria' : 'Salvar categoria'}</button>
          </form>
        </div>
      )}

      {showAddGameModal && selectedGame && (
        <div className="category-modal-backdrop" onClick={() => setShowAddGameModal(false)}>
          <div className="category-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close-btn" onClick={() => setShowAddGameModal(false)}>
              <IconX size={20} />
            </button>
            <span>Adicionar jogo</span>
            <h2>{selectedGame.name}</h2>
            <p className="modal-helper">Escolha a categoria em que o jogo será salvo.</p>

            <div className="modal-category-options">
              {categories.length === 0 ? (
                <p className="category-empty">Crie uma categoria antes de adicionar jogos.</p>
              ) : (
                categories.map((category) => {
                  const alreadyAdded = (category.games || []).some(
                    (game) => Number(game.appid) === Number(selectedGame.appid),
                  );

                  return (
                    <button
                      key={category.id}
                      disabled={alreadyAdded}
                      onClick={() => handleAddGame(category.id)}
                    >
                      <span>{category.name}</span>
                      <small>{alreadyAdded ? 'Já adicionado' : `${category.total_games || 0} jogo(s)`}</small>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamesNew;
