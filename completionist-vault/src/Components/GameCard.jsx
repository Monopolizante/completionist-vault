import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.withCredentials = true;
function GameCard() {
    const [userData, setUserData] = useState(null)

    useEffect(() =>{
        const pegarDadosUsuario =  async () => {
            try{
                const userInfo = await axios.get(`http://localhost:${portaAPI}/api/user`, {withCredentials: true})
                const portaAPI = 3000
                console.log(userInfo)
                //const dadosUser = await axios.get(`http://localhost:${portaAPI}/dados/user/${user_info.data.appid}/jogos`, {withCredentials: true})
            }catch(err){
                console.log(err)
            }}
    }, [] )// array vazio no final serve pra fazer o use effect so rodar uma vez, quando o site for montado

  return (
        <section className='games-list'>

                <div className='game-card'>

                    <img
                        src="src/Images/balatro-pc-game-steam-cover.webp"
                        alt="Balatro"
                    />

                    <div className='game-info'>
                        <h3>Balatro</h3>
                        <p>Achievements</p>

                        <div className='achievements-total'>
                            <span>5 / 31</span>
                        </div>
                    </div>

                </div>
            </section>
  )
}

export default GameCard

