import React, { useState } from 'react'
import axios from 'axios'
import "./pages.css"
function Home() {
    const portaAPI = 3000
    const pegarDados = async () => {
        const user_info = await axios.get(`http://localhost:${portaAPI}/api/user`, {withCredentials: true})
        //const user_games = await axios.get(`http://localhost:${portaAPI}/dados/user/jogos`, {withCredentials: true})
        console.log(user_info)
        console.log(response)
        //console.log(user_games)
        setJogo(response.data.game.gameName)
    }
    const [jogo, setJogo] = useState()
    return (
        <div className="home-main">
            <h3>Bem vindo ao</h3>
            <h1>The Completionist Vault</h1>
            <button onClick={pegarDados}>Clique</button>
            {jogo}
        </div>
    )
}

export default Home
