import {
    IconTrophy,
    IconCircleCheck,
    IconDeviceGamepad2,
    IconClockHour4
} from "@tabler/icons-react";

function StatsCards({ stats }) {

    const totalAchievements = stats?.totalAchievements || 0;
    const completedGames = stats?.completedGames || 0;
    const totalGames = stats?.totalGames || 0;
    const totalHours = stats?.totalHours || "0h";

    return (

        <section className="profileStatsGrid">

            <div className="profileStatCard">

                <div className="statIcon trophyIcon">

                    <IconTrophy size={28} />

                </div>

                <div>

                    <span className="statLabel">
                        Conquistas
                    </span>

                    <h3>
                        {totalAchievements}
                    </h3>

                    <p>
                        Total desbloqueado
                    </p>

                </div>

            </div>

            <div className="profileStatCard">

                <div className="statIcon completeIcon">

                    <IconCircleCheck size={28} />

                </div>

                <div>

                    <span className="statLabel">
                        Jogos completos
                    </span>

                    <h3>
                        {completedGames}
                    </h3>

                    <p>
                        Jogos finalizados em 100%
                    </p>

                </div>

            </div>

            <div className="profileStatCard">

                <div className="statIcon gamesIcon">

                    <IconDeviceGamepad2 size={28} />

                </div>

                <div>

                    <span className="statLabel">
                        Total de jogos
                    </span>

                    <h3>
                        {totalGames}
                    </h3>

                    <p>
                        Jogos na biblioteca
                    </p>

                </div>

            </div>

            <div className="profileStatCard">

                <div className="statIcon hoursIcon">

                    <IconClockHour4 size={28} />

                </div>

                <div>

                    <span className="statLabel">
                        Horas jogadas
                    </span>

                    <h3>
                        {totalHours}
                    </h3>

                    <p>
                        Tempo total registrado
                    </p>

                </div>

            </div>

        </section>

    );

}

export default StatsCards;