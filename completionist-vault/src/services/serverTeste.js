import express from "express"
import axios from "axios"
import 'dotenv/config';
import cors from "cors"

const port = 3000
const app = express()

app.use(cors());
app.use(express.urlencoded({extended: true}))

const API_KEY = process.env.API_KEY;
app.get("/dados/jogo", async (req, res) => {
    try{
        const response = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=105600`)
        res.json(response.data)
    } catch (error){
        res.status(500).json({ error: "Erro pegando os dados da steam"})
    }
})
app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
})