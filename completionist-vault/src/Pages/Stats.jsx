
import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import StatsBar from '../Components/StatsBar';
import axios from 'axios';
import "../Styles/pages.css";
import { useSearchParams } from 'react-router-dom';

function Stats() {
    const portaAPI = 3000
    const[userGames, setUserGames] = useState([])
    const[loading, setLoading] = useState(true)
    const[isLoggedIn, setIsLoggedIn] = useState(false)
    useEffect(() => {
        const pegarDados = async () => {
            try{
                const userInfo = await axios.get(`http://localhost:${portaAPI}/api/user`, { withCredentials: true });
                const dados = await axios.get(`http://localhost:${portaAPI}/dados/user/jogos/${userInfo.data.id}`, { withCredentials: true })
                if (dados.data.jogosUsuario?.response?.games){
                    const respostaDados = dados.data.jogosUsuario.response.games 
                    setUserGames(respostaDados)
                    setIsLoggedIn(true)
                }
                setLoading(false)
            } catch (err){
                console.log(err)
                window.location.href = "http://localhost:3000/auth/steam";
            }
        }
        pegarDados()
    }, [])

    if (loading) {
        return (
          <div className="page">
            <Navbar />
            <div className="sync-loading-text">
              Sincronizando Biblioteca...
            </div>
          </div>
        );
      }

    return (
        <div className='page'>
            <Navbar />
            <StatsBar games={userGames}/>
        </div>
    )
}

export default Stats

