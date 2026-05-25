import {useState} from 'react'
import axios from "axios";

const apiPort = 3000
function Tests() {
    const [jogo, setJogo] = useState("")
    const [conquistas, setConquistas] = useState([])
    const pegarInformacoes = async () => {
    try{
        const response = await axios.get(`http://localhost:${apiPort}/dados/jogo`)
        const respostaRefinada = response.data.game
        console.log(response)
        setJogo(respostaRefinada.gameName)
        setConquistas(respostaRefinada.availableGameStats.achievements)
    
    } catch (error){
        console.log(error)
    }}
  return (
    <div>
        <button onClick={pegarInformacoes}>Teste</button>
        <p>{jogo}</p>
        <ul>
        {conquistas.map((value, index) => (
        <li>{value.displayName}</li>
        ))}
        </ul>
        
    </div>
  )
}

export default Tests
