import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../Components/Navbar";
import ProfileHeader from "../Components/ProfileHeader";
import StatsCards from "../Components/StatsCards";

import gamesData from "../Scripts/gamesData";

import "../Styles/Profile.css";

function Profile() {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const [stats, setStats] = useState({
        totalAchievements: 0,
        completedGames: 0,
        totalGames: 0,
        totalHours: "0h"
    });

    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dashboard, setDashboard] = useState({
        summary: {
            total_categories: 0,
            total_games_in_categories: 0,
            unique_games_organized: 0
        },
        categories: []
    });

    useEffect(() => {

        const carregarPerfil = async () => {
            const portaAPI = 3000;
            const apiBase = `http://localhost:${portaAPI}`;

            try {
                // A autenticação é verificada primeiro e de forma independente.
                // Assim, um erro ao buscar jogos da Steam não transforma um usuário
                // autenticado em visitante com dados de demonstração.
                const userInfo = await axios.get(`${apiBase}/api/user`, {
                    withCredentials: true
                });

                setUser(userInfo.data);
                setIsLoggedIn(true);

                const steamId =
                    userInfo.data?.id ||
                    userInfo.data?._json?.steamid ||
                    userInfo.data?.steamid;

                // Jogos da Steam e dashboard do PostgreSQL são carregados separadamente.
                // Se uma das APIs falhar, a outra continua aparecendo normalmente.
                const [gamesResult, dashboardResult] = await Promise.allSettled([
                    steamId
                        ? axios.get(`${apiBase}/dados/user/jogos/${steamId}`, {
                            withCredentials: true
                        })
                        : Promise.reject(new Error("Steam ID não encontrado na sessão.")),
                    axios.get(`${apiBase}/api/dashboard`, {
                        withCredentials: true
                    })
                ]);

                if (gamesResult.status === "fulfilled") {
                    const jogosSteam =
                        gamesResult.value.data.jogosUsuario?.response?.games || [];

                    setGames(jogosSteam);
                    calcularStats(jogosSteam, true);
                } else {
                    console.error(
                        "Não foi possível carregar os jogos da Steam:",
                        gamesResult.reason
                    );
                    setGames([]);
                    calcularStats([], true);
                }

                if (dashboardResult.status === "fulfilled") {
                    setDashboard({
                        summary: {
                            total_categories: Number(
                                dashboardResult.value.data?.summary?.total_categories || 0
                            ),
                            total_games_in_categories: Number(
                                dashboardResult.value.data?.summary?.total_games_in_categories || 0
                            ),
                            unique_games_organized: Number(
                                dashboardResult.value.data?.summary?.unique_games_organized || 0
                            )
                        },
                        categories: dashboardResult.value.data?.categories || []
                    });
                } else {
                    console.error(
                        "A rota /api/dashboard falhou. Tentando carregar /api/categories:",
                        dashboardResult.reason
                    );

                    // Compatibilidade com versões em que apenas o CRUD de categorias existe.
                    try {
                        const categoriesResponse = await axios.get(
                            `${apiBase}/api/categories`,
                            { withCredentials: true }
                        );

                        const categories = categoriesResponse.data || [];
                        const allGames = categories.flatMap(
                            (category) => category.games || []
                        );
                        const uniqueGames = new Set(
                            allGames.map((game) => String(game.appid))
                        );

                        setDashboard({
                            summary: {
                                total_categories: categories.length,
                                total_games_in_categories: allGames.length,
                                unique_games_organized: uniqueGames.size
                            },
                            categories
                        });
                    } catch (categoriesError) {
                        console.error(
                            "Não foi possível carregar as categorias do banco:",
                            categoriesError
                        );
                    }
                }

            } catch (err) {
                // Somente uma falha real na autenticação ativa os dados de demonstração.
                console.log(
                    "Usuário não autenticado. Carregando dados de demonstração.",
                    err
                );

                setUser({
                    personaname: "Jogador Visitante",
                    avatarfull: ""
                });

                setGames(gamesData);
                setIsLoggedIn(false);
                calcularStats(gamesData, false);

            } finally {
                setLoading(false);
            }
        };

        carregarPerfil();

    }, []);

    const calcularStats = (listaJogos, logado) => {

        if (!listaJogos || listaJogos.length === 0) {

            setStats({
                totalAchievements: 0,
                completedGames: 0,
                totalGames: 0,
                totalHours: "0h"
            });

            return;

        }

        const totalGames = listaJogos.length;

        const totalAchievements = listaJogos.reduce((acc, game) => {

            const unlocked = logado
                ? Number(game.unlocked || 0)
                : Number(game.unlocked || 0);

            return acc + unlocked;

        }, 0);

        const completedGames = listaJogos.filter((game) => {

            const unlocked = Number(game.unlocked || 0);
            const total = Number(game.total || 0);

            return total > 0 && unlocked === total;

        }).length;

        const totalMinutes = listaJogos.reduce((acc, game) => {

            if (logado) {

                return acc + Number(game.playtime_forever || 0);

            }

            const hoursString = String(game.hours || "0h").replace("h", "");
            const hoursNumber = Number(hoursString) || 0;

            return acc + hoursNumber * 60;

        }, 0);

        const totalHours = `${Math.round(totalMinutes / 60)}h`;

        setStats({
            totalAchievements,
            completedGames,
            totalGames,
            totalHours
        });

    };

    if (loading) {

        return (

            <div className="profilePage">

                <div className="profileLoading">

                    <div className="loadingRune"></div>

                    <p>Carregando perfil do jogador...</p>

                </div>

            </div>

        );

    }

    return (

        <div className="profilePage">

            <main className="profileContainer">

                <div className="profilePageHeader">

                    <span className="profileEyebrow">
                        Painel do Jogador
                    </span>

                    <h1>
                        Perfil do Vault
                    </h1>

                    <p>
                        Suas conquistas, progresso e estatísticas reunidas em uma tela
                        inspirada em menus de RPG.
                    </p>

                </div>

                {!isLoggedIn && (

                    <div className="profileDemoAlert">

                        <div>
                            <strong>Modo demonstração ativo</strong>

                            <p>
                                Você está vendo dados de demonstração. Conecte sua conta Steam
                                para sincronizar suas estatísticas reais.
                            </p>
                        </div>

                        <button
                            className="profileDemoButton"
                            onClick={() => navigate("/loginVault")}
                        >
                            Conectar Steam
                        </button>

                    </div>

                )}
                <ProfileHeader user={user} />

                <StatsCards stats={stats} />


                {isLoggedIn && (
                    <section className="databaseDashboard">

                        <div className="databaseDashboardHeader">
                            <div>
                                <span>Dados do PostgreSQL</span>
                                <h2>Dashboard de Categorias</h2>

                            </div>
                        </div>

                        <div className="databaseDashboardStats">
                            <article>
                                <span>Categorias criadas</span>
                                <strong>{dashboard.summary.total_categories || 0}</strong>
                            </article>

                            <article>
                                <span>Vínculos de jogos</span>
                                <strong>{dashboard.summary.total_games_in_categories || 0}</strong>
                            </article>

                            <article>
                                <span>Jogos únicos organizados</span>
                                <strong>{dashboard.summary.unique_games_organized || 0}</strong>
                            </article>
                        </div>

                        <div className="databaseCategoriesGrid">
                            {dashboard.categories.length === 0 ? (
                                <p className="databaseEmptyState">
                                    Nenhuma categoria cadastrada no banco de dados.
                                </p>
                            ) : (
                                dashboard.categories.map((category) => (
                                    <article className="databaseCategoryCard" key={category.id}>
                                        <div>
                                            <h3>{category.name}</h3>
                                            <span>{category.total_games} jogo(s)</span>
                                        </div>

                                        <p>{category.description || "Categoria sem descrição."}</p>

                                        <div className="databaseGameList">
                                            {(category.games || []).length === 0 ? (
                                                <small>Nenhum jogo adicionado.</small>
                                            ) : (
                                                category.games.map((game) => {
                                                    const appid = game.appid || game.appId;
                                                    const steamGame = games.find(
                                                        (libraryGame) => Number(libraryGame.appid) === Number(appid)
                                                    );

                                                    const gameName =
                                                        game.game_name ||
                                                        game.gameName ||
                                                        game.name ||
                                                        steamGame?.name ||
                                                        `Jogo ${appid}`;

                                                    const gameImage =
                                                        game.image_url ||
                                                        game.imageUrl ||
                                                        game.image ||
                                                        steamGame?.image ||
                                                        `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`;

                                                    return (
                                                        <div key={`${category.id}-${appid}`}>
                                                            <img
                                                                src={gameImage}
                                                                alt={gameName}
                                                                onError={(event) => {
                                                                    event.currentTarget.onerror = null;
                                                                    event.currentTarget.src =
                                                                        `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;
                                                                }}
                                                            />
                                                            <span>{gameName}</span>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>

                    </section>
                )}

                <section className="profileSummaryPanel">

                    <div className="summaryText">

                        <span>Resumo da Jornada</span>

                        <h2>
                            Sua aventura como completionist começou.
                        </h2>

                        <p>
                            Cada conquista desbloqueada gera progresso, cada jogo completo
                            fortalece seu perfil e cada novo título aumenta seu legado dentro
                            do Completionist Vault.
                        </p>

                    </div>

                    <div className="summaryList">

                        <div>
                            <strong>{stats.totalAchievements}</strong>
                            <span>Conquistas coletadas</span>
                        </div>

                        <div>
                            <strong>{stats.completedGames}</strong>
                            <span>Jogos dominados</span>
                        </div>

                        <div>
                            <strong>{stats.totalGames}</strong>
                            <span>Jogos na biblioteca</span>
                        </div>

                    </div>

                </section>

            </main>

        </div>

    );

}

export default Profile;