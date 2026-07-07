import "../Styles/VaultLevel.css";

import {
    IconShieldStar,
    IconSword,
    IconTargetArrow,
    IconCrown,
    IconMedal2,
    IconTrophy,
    IconSparkles
} from "@tabler/icons-react";

function VaultLevel() {
    // Dados locais por enquanto
    const level = 27;
    const currentXP = 3850;
    const nextLevelXP = 5000;

    const progress = (currentXP / nextLevelXP) * 100;

    const getRank = (level) => {
        if (level >= 100) {
            return {
                title: "Vault Master",
                icon: <IconTrophy size={22} stroke={2} />
            };
        }
        if (level >= 80) {
            return {
                title: "Legend",
                icon: <IconCrown size={22} stroke={2} />
            };
        }
        if (level >= 60) {
            return {
                title: "Vault Guardian",
                icon: <IconShieldStar size={22} stroke={2} />
            };
        }
        if (level >= 40) {
            return {
                title: "Completionist",
                icon: <IconMedal2 size={22} stroke={2} />
            };
        }
        if (level >= 20) {
            return {
                title: "Achievement Hunter",
                icon: <IconTargetArrow size={22} stroke={2} />
            };
        }
        if (level >= 10) {
            return {
                title: "Explorer",
                icon: <IconSword size={22} stroke={2} />
            };
        }
        return {
            title: "Newcomer",
            icon: <IconSparkles size={22} stroke={2} />
        };
    };
    
    // Pegamos o objeto aqui
    const rank = getRank(level);
    
    const getLevelColor = (level) => {
        if (level >= 100) return "#FFD700";
        if (level >= 80) return "#ff4d4d";
        if (level >= 60) return "#ff7a18";
        if (level >= 40) return "#8b5cf6";
        if (level >= 20) return "#27c93f";
        return "#3b82f6";
    };

    const color = getLevelColor(level);

    return (
        <div className="vaultLevel">
            <div className="vaultHeader">
                <div>
                    <span className="vaultTitle">
                        Vault Level
                    </span>
                    <h2 style={{ color }}> {level} </h2>
                </div>

                {/* CORREÇÃO AQUI: Acessando as propriedades do objeto rank */}
                <div className="vaultRank" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {rank.icon}
                    <span>{rank.title}</span>
                </div>
            </div>

            <div className="vaultBarBackground">
                <div
                    className="vaultBarFill"
                    style={{
                        width: `${progress}%`,
                        background: `linear-gradient(
                            90deg,
                            ${color},
                            #ffffff,
                            ${color}
                        )`
                    }}
                />
            </div>

            <div className="vaultXP">
                <span>{currentXP} VP</span>
                <span>{nextLevelXP} VP</span>
            </div>
        </div>
    );
}

export default VaultLevel;