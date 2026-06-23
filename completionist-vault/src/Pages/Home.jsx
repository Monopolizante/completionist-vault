import React, { useState } from 'react';
import axios from 'axios';
import "../Styles/pages.css";
import Navbar from '../Components/Navbar';
import StatsBar from '../Components/StatsBar';
import gamesData from '../Scripts/gamesData';


function Home() {
  const portaAPI = 3000
  const pegarDados = async () => {
    const user_info = await axios.get(`http://localhost:${portaAPI}/api/user`, { withCredentials: true })
    //const user_games = await axios.get(`http://localhost:${portaAPI}/dados/user/jogos`, {withCredentials: true})
    console.log(user_info)
    console.log(response)
    //console.log(user_games)
    setJogo(response.data.game.gameName)
  }
  const [jogo, setJogo] = useState()

  return (
    <div className="page">

      <Navbar />
      <div>
        <h1>Aqui e o home</h1>
      </div>
      <footer>
        © 2026 DogTeam
      </footer>
    </div>
  )
}

export default Home
