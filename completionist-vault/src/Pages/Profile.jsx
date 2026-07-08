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

    useEffect(() => {

        const carregarPerfil = async () => {

            try {

                const portaAPI = 3000;

                const userInfo = await axios.get(
                    `http://localhost:${portaAPI}/api/user`,
                    { withCredentials: true }
                );

                const dados = await axios.get(
                    `http://localhost:${portaAPI}/dados/user/jogos/${userInfo.data.id}`,
                    { withCredentials: true }
                );

                const jogosSteam = dados.data.jogosUsuario?.response?.games || [];

                setUser(userInfo.data);
                setGames(jogosSteam);
                setIsLoggedIn(true);

                calcularStats(jogosSteam, true);

            } catch (err) {

                console.log("Usuário deslogado ou erro na API, carregando dados de demonstração.");

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