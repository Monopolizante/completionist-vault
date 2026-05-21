

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
