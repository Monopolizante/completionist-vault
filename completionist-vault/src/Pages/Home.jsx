import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Styles/pages.css";
import "../Styles/Home.css";
import Navbar from '../Components/Navbar';
import StatsBar from '../Components/StatsBar';
import gamesData from '../Scripts/gamesData';
import CardPreview from '../Components/CardPreview';



function Home() {
  const portaAPI = 3000;
  const pegarDados = async () => {
    const user_info = await axios.get(`http://localhost:${portaAPI}/api/user`, { withCredentials: true })
    //const user_games = await axios.get(`http://localhost:${portaAPI}/dados/user/jogos`, {withCredentials: true})
    console.log(user_info)
    console.log(response)
    //console.log(user_games)
    setJogo(response.data.game.gameName)
  };
  const [jogo, setJogo] = useState();
  const navigate = useNavigate();



  return (
    <div className="page">

      <Navbar />
      <main className="home">

        {/* HERO */}

        <section className="hero">

          <div className="heroTexto">

            <span className="badge">
              Conectado com Steam API
            </span>

            <h1>
              Completionist Vault
            </h1>

            <p>
              O Completionist Vault é uma plataforma desenvolvida
              para acompanhar o progresso dos seus jogos na Steam.
              Visualize sua biblioteca, acompanhe conquistas
              desbloqueadas e descubra o quanto falta para atingir
              os tão desejados 100%.
            </p>

            <div className="heroBotoes">

              <button className="btnPrincipal" onClick={() => navigate("/loginvault")}>
                Começar Agora
              </button>

              <button className="btnSecundario" onClick={() => navigate("/About")}>
                Saiba Mais
              </button>

            </div>

          </div>

          <div className="heroCard">

            <CardPreview />

          </div>

        </section>

        {/* SOBRE */}

        <section className="sobre">

          <h2>O que é o Completionist Vault?</h2>

          <p>

            Nosso sistema utiliza a API da Steam para reunir todas
            as informações da sua conta em um único lugar. Assim,
            você consegue acompanhar facilmente quais jogos possui,
            quais conquistas já desbloqueou e quanto falta para
            completar cada título.

          </p>

        </section>

        {/* FUNCIONALIDADES */}

        <section className="funcionalidades">

          <h2>Principais Funcionalidades</h2>

          <div className="cards">

            <div className="card">

              <div className="icone">🎮</div>

              <h3>Biblioteca Steam</h3>

              <p>

                Visualize todos os jogos disponíveis na sua
                biblioteca Steam em uma única página.

              </p>

            </div>

            <div className="card">

              <div className="icone">🏆</div>

              <h3>Conquistas</h3>

              <p>

                Veja quais conquistas foram desbloqueadas e quais
                ainda faltam para completar seus jogos.

              </p>

            </div>

            <div className="card">

              <div className="icone">📊</div>

              <h3>Progresso</h3>

              <p>

                Acompanhe sua porcentagem de conclusão através
                de barras de progresso simples e intuitivas.

              </p>

            </div>

          </div>

        </section>

        {/* COMO FUNCIONA */}

        <section className="comoFunciona">

          <h2>Como Funciona?</h2>

          <div className="passos">

            <div className="passo">

              <span>1</span>

              <h3>Informe sua conta Steam</h3>

            </div>

            <div className="seta">
              ➜
            </div>

            <div className="passo">

              <span>2</span>

              <h3>Buscamos seus jogos</h3>

            </div>

            <div className="seta">
              ➜
            </div>

            <div className="passo">

              <span>3</span>

              <h3>Exibimos suas conquistas</h3>

            </div>

          </div>

        </section>

        {/* TECNOLOGIAS */}

        <section className="tecnologias">

          <h2>Tecnologias Utilizadas</h2>

          <div className="techGrid">

            <div>React</div>

            <div>Steam API</div>

            <div>JavaScript</div>

            <div>CSS</div>

          </div>

        </section>

        {/* RODAPÉ */}

        <footer>

          <h3>Completionist Vault</h3>

          <p>
            Desenvolvido pela DogTeam.
          </p>

          <p>
            Projeto acadêmico utilizando React e Steam API.
          </p>

        </footer>

      </main>
    </div>
  )
}

export default Home
