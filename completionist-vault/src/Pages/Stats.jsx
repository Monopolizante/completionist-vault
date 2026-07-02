
import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import StatsBar from '../Components/StatsBar';
import "../Styles/pages.css";
import { useSearchParams } from 'react-router-dom';

function Stats() {
    const[games, setGames] = useState([])
    useEffect(() => {
        const pegarDados = async () => {
            const games = (await axios.get(`http://localhost:${portaAPI}/dados/user/jogos/${userInfo.data.id}`, { withCredentials: true }))
            console.log(games)
        }
    })
    return (
        <div className='page'>
            <Navbar />
            <StatsBar games={games}/>
        </div>
    )
}

export default Stats

