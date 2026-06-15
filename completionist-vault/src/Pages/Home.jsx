import React, { useState } from 'react'
import axios from 'axios'
import "./pages.css"
import Navbar from '../Components/Navbar'


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


            <div className='stats-bar'>
                <div className='stats-cards'>
                    <span className='stats-label'>Achievements</span>
                    <span className='stats-value'> 600 </span>
                    <span className='stats-sub'>of 1.540</span>
                </div>
                <div className='stats-cards'>
                    <span className='stats-label'>Time Played</span>
                    <span className='stats-value'> 1.050h </span>
                    <span className='stats-sub'>Last 4 months</span>

                </div>
                <div className='stats-cards'>
                    <span className='stats-label'>100% Completed</span>
                    <span className='stats-value'> 4 </span>
                    <span className='stats-sub'>perfect games</span>

                </div>
            </div>

            <footer>
                © 2026 DogTeam
            </footer>
        </div>
    )
}

export default Home

{/*             <h3>Bem vindo ao</h3>
            <h1>The Completionist Vault</h1>
            <button onClick={pegarDados}>Clique</button>
            {jogo} */}