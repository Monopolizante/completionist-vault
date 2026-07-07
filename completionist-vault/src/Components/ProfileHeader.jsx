import VaultLevel from "./VaultLevel";

import {
    IconUser,
    IconBrandSteam,
    IconShieldCheck
} from "@tabler/icons-react";

function ProfileHeader({ user }) {

const steamUser = user?.user || user?.profile || user?.data || user;

const avatar =
    steamUser?.avatarfull ||
    steamUser?.avatarmedium ||
    steamUser?.avatar ||
    steamUser?.photos?.[2]?.value ||
    steamUser?.photos?.[1]?.value ||
    steamUser?.photos?.[0]?.value ||
    "";

const name =
    steamUser?.personaname ||
    steamUser?.displayName ||
    steamUser?.username ||
    steamUser?.name ||
    "Jogador Steam";

    return (

        <section className="profileHeader">

            <div className="profileAvatarWrapper">

                {avatar ? (

                    <img
                        src={avatar}
                        alt={`Avatar de ${name}`}
                        className="profileAvatar"
                    />

                ) : (

                    <div className="profileAvatarFallback">

                        <IconUser size={48} />

                    </div>

                )}

                <div className="profileOnlineBadge">

                    <IconShieldCheck size={16} />

                </div>

            </div>

            <div className="profileInfo">

                <div className="profileTag">

                    <IconBrandSteam size={18} />

                    <span>Perfil Steam conectado</span>

                </div>

                <h1>{name}</h1>

                <p>
                    Acompanhe seu progresso, conquistas desbloqueadas,
                    jogos completos e evolução dentro do Completionist Vault.
                </p>

                <div className="profileMeta">

                    <span>Classe: Completionist</span>

                    <span>Guilda: DogTeam</span>

                    <span>Status: Sincronizado</span>

                </div>

            </div>

            <div className="profileLevelBox">

                <VaultLevel />

            </div>

        </section>

    );

}

export default ProfileHeader;