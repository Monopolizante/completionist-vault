<<<<<<< HEAD
import React from 'react'

function GameCard() {
  return (
        <section className='games-list'>

                <div className='game-card'>

                    <img
                        src="src/Images/balatro-pc-game-steam-cover.webp"
                        alt="Balatro"
                    />

                    <div className='game-info'>
                        <h3>Balatro</h3>
                        <p>Achievements</p>

                        <div className='achievements-total'>
                            <span>5 / 31</span>
                        </div>
                    </div>

                </div>

            </section>
  )
}

export default GameCard

=======


function GameCard({ name, achievements }) {
    return (
        <div className="game-card">
            <h3>{name}</h3>
            <p>Conquistas: {achievements.length}</p>
            {/* Aqui você pode adicionar uma barra de progresso depois */}
        </div>
    );
}
export default GameCard;
>>>>>>> a7d68c183f551d53ccdba568ddfeb62543f09e7c
