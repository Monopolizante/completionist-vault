import React from 'react'
import Navbar from '../Components/Navbar'
import "../Styles/About.css";

function About() {
  return (
    <div className="aboutPage">
      <Navbar />

      <main className="aboutContainer">

        <section className="aboutHero">
          <span className="aboutBadge">Completionist Vault</span>

          <h1>Sobre o Projeto</h1>

          <p>
            Para quem não joga apenas pela história, mas pelo desafio absoluto.
            O Completionist Vault nasceu para transformar cada conquista,
            platina e 100% em reconhecimento dentro de uma plataforma feita
            para caçadores de troféus.
          </p>
        </section>

        <section className="aboutSection">
          <h2>O que é o Completionist Vault?</h2>

          <p>
            O Completionist Vault é o santuário definitivo para os caçadores
            de conquistas. Nós nascemos para dar um novo propósito à sua
            obsessão saudável pelos 100%. Mais do que um agregador de perfis,
            somos o lugar onde seu suor virtual se transforma em reconhecimento.
          </p>

          <div className="aboutCards">

            <div className="aboutCard">
              <h3>Organização Suprema</h3>
              <p>
                Acompanhe seu progresso, organize sua coleção de troféus e
                exiba suas platinas em um perfil feito de gamer para gamer.
              </p>
            </div>

            <div className="aboutCard">
              <h3>Sua Platina Vale Ouro</h3>
              <p>
                Cada conquista desbloqueada se transforma em pontos dentro da
                plataforma. Quanto maior o desafio, maior o reconhecimento.
              </p>
            </div>

            <div className="aboutCard">
              <h3>O Cofre de Cosméticos</h3>
              <p>
                Use seus pontos acumulados para desbloquear cosméticos,
                insígnias e personalizações para exibir no seu perfil.
              </p>
            </div>

          </div>
        </section>

        <section className="teamSection">
          <div className="teamHeader">
            <span className="aboutBadge">DogTeam</span>
            <h2>Sobre a Equipe</h2>
            <p>
              Grupo formado por 3 programadores entusiastas, cada um com sua
              classe especial nessa party de desenvolvimento.
            </p>
          </div>

          <div className="teamGrid">

            <div className="teamCard">
              <div className="teamAvatar">C</div>
              <h3>Caio</h3>
              <span>O Observador</span>
              <p>
                Fica só ouvindo o que o Luka e o Robson falam, absorvendo o caos
                como um NPC lendário de tutorial.
              </p>
            </div>

            <div className="teamCard">
              <div className="teamAvatar">L</div>
              <h3>Luka</h3>
              <span>Mago do Front-end</span>
              <p>
                Invoca telas, animações e componentes com magia CSS e feitiços
                de React.
              </p>
            </div>

            <div className="teamCard">
              <div className="teamAvatar">R</div>
              <h3>Robzon</h3>
              <span>Eletricista do Back-end</span>
              <p>
                Faz o servidor funcionar na base da lógica, café e uma reza
                braba quando a API resolve lutar contra o destino.
              </p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default About;