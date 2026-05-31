import React from 'react'
import Cards from '../Components/Cards'
import GameCard from '../Components/GameCard'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../Components/Navbar'

function Games() {
    const [userData, setUserData] = useState([])

    useEffect(() =>{
        const pegarDadosUsuario =  async () => {
            try{
                const portaAPI = 3000
                const userInfo = await axios.get(`http://localhost:${portaAPI}/api/user`, {withCredentials: true})
                const dadosUser = await axios.get(`http://localhost:${portaAPI}/dados/user/jogos/${userInfo.data.id}`, {withCredentials: true})
                const idJogosUser = dadosUser.data.response.games
                setUserData(idJogosUser)
                
            }catch(err){
                console.log(err)
            }}
        pegarDadosUsuario()
    }, [] ) // array vazio no final serve pra fazer o use effect so rodar uma vez, quando o site for montado
    return (
        <div>
            <Navbar />
            
            {userData.map((jogo) => {
                const urlImagem = jogo.img_logo_url 
                    ? `https://media.steampowered.com/steamcommunity/public/images/apps/${jogo.appid}/${jogo.img_logo_url}.jpg`
                    : `https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/header.jpg`; // Fallback seguro
                console.log(urlImagem)
                return(
                    <GameCard game={jogo} key={jogo.appid} imagemJogo={urlImagem} />
                )
            })}
        </div>
    )
}

export default Games
