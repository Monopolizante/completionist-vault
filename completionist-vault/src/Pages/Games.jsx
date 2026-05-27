import React from 'react'
import Cards from './Cards'
import GameCard from '../Components/GameCard'
import { useState, useEffect } from 'react'
import axios from 'axios'

function Games() {
    const [userData, setUserData] = useState(null)

    useEffect(() =>{
        const pegarDadosUsuario =  async () => {
            try{
                const userGames = []
                const portaAPI = 3000
                const userInfo = await axios.get(`http://localhost:${portaAPI}/api/user`, {withCredentials: true})
                console.log(userInfo.data.id)
                const dadosUser = await axios.get(`http://localhost:${portaAPI}/dados/user/jogos/${userInfo.data.id}`, {withCredentials: true})
                const idJogosUser = dadosUser.data.response.games
                
                console.log(dadosUser)
            }catch(err){
                console.log(err)
            }}
        pegarDadosUsuario()
    }, [] ) // array vazio no final serve pra fazer o use effect so rodar uma vez, quando o site for montado
    return (
        <div>

            <Cards />
            <GameCard />
        </div>
    )
}

export default Games
