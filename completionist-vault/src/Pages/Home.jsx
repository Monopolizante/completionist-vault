import React, { useState } from 'react'
import axios from 'axios'

function Home() {
    const portaAPI = 3000
    const pegarDados = async () => {
        const response = await axios.get(`http://localhost:${portaAPI}/dados/jogo`)
        console.log(response)
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
