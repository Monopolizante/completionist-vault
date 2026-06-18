import { useState } from "react";
import Navbar from "../Components/Navbar";
import { IconAugmentedReality } from '@tabler/icons-react'; //Icon vault / <IconAugmentedReality stroke={1.5} />
import { IconCircleDashedCheck } from '@tabler/icons-react'; //Icon Check / <IconCircleDashedCheck stroke={1.5} />
import { IconBrandSteam } from '@tabler/icons-react'; //Icon Steam / <IconBrandSteam stroke={2} />
import { IconLogin } from '@tabler/icons-react'; //Icon Login / <IconLogin stroke={2} />
import "./pages.css";
import "./Login.css";

function LoginNew() {
    const [activeScreen, setActiveScreen] = useState("login");

    return (
        <div className='page'>
            <Navbar />

            {/* Tela padrao do login */}
            {activeScreen === "login" && (
                <div className="screen active">
                    <div className="box">
                        <div className="logo">
                            <div className="logo-icon">
                                <IconAugmentedReality stroke={1.5} />
                            </div>
                            <span className="logo-name">Vault Account</span>
                        </div>

                        <p className="section-label">entrar na conta</p>
                        <div className="card">
                            <div className="field">
                                <label>Email ou usuário</label>
                                <input type="text" placeholder="Name@email.com" />
                            </div>
                            <div className="field">
                                <label>Senha</label>
                                <input type="password" placeholder="••••••••" />
                                <a className="forgot" href="#">Esqueceu a senha?</a>
                            </div>
                            <button className="btn-primary">
                                <IconLogin stroke={2} />
                                Entrar
                            </button>
                        </div>

                        <div className="divider">
                            <div className="divider-line"></div>
                            <span className="divider-text">ou entre / cadastre-se com</span>
                            <div className="divider-line"></div>
                        </div>

                        {/* Ativa a ""TELA DE COMPLETAR CADASTRO (APENAS ENFEITE POR ENAQUANTO)"" */}
                        <button className="btn-steam" onClick={() => setActiveScreen("complete")}>
                            <svg className="steam-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.187.008l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z" />
                            </svg>
                            Continuar com Steam
                        </button>
                        <p className="steam-note">Novo por aqui? Sua conta será criada automaticamente.</p>
                    </div>
                </div>
            )}

            {/* Tela para criar o perfil (Vai aparecer depois de entrar com conta steam... ou antes n sei) */}
            {activeScreen === "complete" && (
                <div id="screen-complete" className="screen active">
                    <div className="box">
                        <div className="logo">
                            <div className="logo-icon">
                                <IconAugmentedReality stroke={1.5} />
                            </div>
                            <span className="logo-name">Vault Account</span>
                        </div>

                        {/*Bolinhas de progresso ui ui gay*/}
                        <div className="progress-steps">
                            <div className="step-dot done"></div>
                            <div className="step-dot active"></div>
                            <div className="step-dot"></div>
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
                                <label>Email</label>
                                <input type="email" placeholder="Name@email.com" />
                            </div>
                            <div className="field-row">
                                <div className="field" style={{ marginBottom: 0 }}>
                                    <label>Senha</label>
                                    <input type="password" placeholder="••••••••" />
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

                        {/* Volta para a tela de login... eu acho */}
                        <button className="back-btn" onClick={() => setActiveScreen("login")}>
                            <i className="ti ti-arrow-left" style={{ fontSize: "14px" }} aria-hidden="true"></i>
                            Voltar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginNew;