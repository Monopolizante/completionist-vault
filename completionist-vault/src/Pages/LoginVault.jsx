import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { IconAugmentedReality } from '@tabler/icons-react'; //Icon vault / <IconAugmentedReality stroke={1.5} />
import { IconCircleDashedCheck } from '@tabler/icons-react'; //Icon Check / <IconCircleDashedCheck stroke={1.5} />
import { IconBrandSteam } from '@tabler/icons-react'; //Icon Steam / <IconBrandSteam stroke={2} />
import { IconLogin } from '@tabler/icons-react'; //Icon Login / <IconLogin stroke={2} />

import "../Styles/pages.css";
import "../Styles/Login.css";
import Navbar from '../Components/Navbar';


function LoginVault() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/user", { withCredentials: true });
                if (response.data) {
                    setUser(response.data);
                }
            } catch (err) {
                setUser(null);
            }
        };
        checkUser();
    }, []);

    return (
        <div className='page'>
            <Navbar />
            <form action="/cadastro" method='post'>
                <div id="screen-complete" className="screen active">
                    <div className="box">
                        <div className="logo">
                            <div className="logo-icon">
                                <IconAugmentedReality stroke={1.5} />
                            </div>
                            <span className="logo-name">Vault Account</span>
                        </div>

                        <p className="section-label">quase lá — complete seu perfil</p>

                        <div className="steam-connected">
                            <div className="steam-avatar"><IconBrandSteam stroke={1.5} /></div>
                            <div className="steam-connected-info">
                                <div className="steam-connected-name">Luck_Css</div>
                                <div className="steam-connected-sub">Steam conectada com sucesso</div>
                            </div>
                            <div className="steam-check">
                                <IconCircleDashedCheck stroke={1.5} />
                            </div>
                        </div>

                        <div className="card">
                            <div className="field">
                                <label>Nome de usuário Vault Account</label>
                                <input type="text" placeholder="como quer ser chamado?" defaultValue="Luck_Css" />
                                <p className="hint">Pode ser diferente do seu nick na Steam.</p>
                            </div>
                            <div className="field">
                                <label for="email">Email</label>
                                <input type="email" placeholder="Name@email.com" name="email" />
                            </div>
                            <div className="field-row">
                                <div className="field" style={{ marginBottom: 0 }}>
                                    <label>Senha</label>
                                    <input type="password" placeholder="••••••••" name="senha" />
                                </div>
                                <div className="field" style={{ marginBottom: 0 }}>
                                    <label>Confirmar senha</label>
                                    <input type="password" placeholder="••••••••" />
                                </div>
                            </div>
                            <button className="btn-primary" style={{ marginTop: "16px" }}>
                                <IconAugmentedReality stroke={1.5} />
                                Criar minha conta
                            </button>
                        </div>
                    </div>
                </div>




            </form>
        </div>
    )
}

export default LoginVault