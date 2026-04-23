import React, { useState, useEffect } from 'react';
import { getGameData } from '../services/api';
import GameCard from '../components/GameCard';

function MainPage() {
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await getGameData();
            setGame(response.data.game);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-main">
            <header className="steam-header">
                <input type="text" placeholder="Pesquisar ID do Jogo..." />
                <button onClick={handleSearch}>Buscar</button>
            </header>

            <main className="content">
                {loading && <p>Carregando...</p>}
                
                {game && (
                    <div className="game-info">
                        <GameCard 
                            name={game.gameName} 
                            achievements={game.availableGameStats.achievements} 
                        />
                        
                        <ul className="achievement-list">
                            {game.availableGameStats.achievements.map((ach, index) => (
                                <li key={index} className="achievement-item">
                                    <img src={ach.icon} alt="" />
                                    <span>{ach.displayName}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}

export default MainPage;
