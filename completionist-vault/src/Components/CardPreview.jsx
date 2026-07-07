import { useState, useEffect } from "react";
import { IconTrophy } from "@tabler/icons-react";

import gamesData from "../Scripts/gamesData";
import "../Styles/Cards.css";

function CardPreview() {

    const [currentGame, setCurrentGame] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrentGame((prev) =>
                (prev + 1) % gamesData.length
            );

        }, 3000);

        return () => clearInterval(interval);

    }, []);

    const game = gamesData[currentGame];

    const getPctColor = (pct) => {
        if (pct === 100) return "#f5c518";
        if (pct >= 70) return "#22c97a";
        if (pct >= 40) return "#4e8cff";
        return "#555";
    };

    const porcentagem = Math.round((game.unlocked / game.total) * 100);

    const pctColor = getPctColor(porcentagem);

    const isComplete = porcentagem === 100;

    return (

        <div>

            <div
                className="game-card preview-card"
                style={{
                    width: "280px",
                    animation: "fadeCard .35s"
                }}
            >

                <div className="game-cover-inner">

                    <div
                        className="game-cover-bg"
                        style={{
                            backgroundImage: `url(${game.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: "100%",
                            width: "100%"
                        }}
                    />

                    {game.recent && (
                        <div className="recently-played-badge">
                            Recente
                        </div>
                    )}

                </div>

                <div className="game-info">

                    <div className="game-name">
                        {game.name}
                    </div>

                    <div className="achievements-row">

                        <div className="achievements-label">

                            <IconTrophy
                                size={14}
                                style={{ color: pctColor }}
                            />

                            Achievements

                        </div>

                        <span
                            className="achievements-count"
                            style={{ color: pctColor }}
                        >
                            {game.unlocked}/{game.total} ({porcentagem}%)
                        </span>

                    </div>

                    <div className="progress-bar-bg">

                        <div
                            className={`progress-bar-fill ${isComplete ? "progress-shimmer" : ""}`}
                            style={{
                                width: `${porcentagem}%`,
                                backgroundColor: pctColor
                            }}
                        />

                    </div>

                    <div className="game-meta">

                        <span className="game-platform">
                            {game.platform}
                        </span>

                        <span className="game-hours">
                            {game.hours}
                        </span>

                    </div>

                </div>

            </div>

            <div className="carouselDots">

                {gamesData.map((_, index) => (

                    <span
                        key={index}
                        className={
                            index === currentGame
                                ? "dot active"
                                : "dot"
                        }
                    />

                ))}

            </div>

        </div>

    );

}

export default CardPreview;