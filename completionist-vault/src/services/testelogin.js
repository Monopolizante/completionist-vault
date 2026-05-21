import express from "express";
import axios from "axios";
import 'dotenv/config';
import cors from "cors";
// 1. Importando os novos pacotes (lembre de dar npm install neles)
import session from "express-session";
import passport from "passport";
import { Strategy as SteamStrategy } from "passport-steam";

const port = 3000; // Porta do Backend
const URL_REACT = "http://localhost:5173"; // MUDE ISSO para a porta que o seu React estiver rodando
const app = express();

// 2. Ajuste CRÍTICO no CORS para permitir o envio de cookies de sessão
app.use(cors({
    origin: URL_REACT,
    credentials: true
}));

app.use(express.urlencoded({extended: true}));

// 3. Configurando a Sessão (Obrigatório para o Passport funcionar)
app.use(session({
    secret: process.env.SESSION_SECRET || 'uma_chave_secreta_qualquer_para_testes', // Pode colocar no .env depois
    resave: false,
    saveUninitialized: false
}));

// 4. Inicializando o Passport
app.use(passport.initialize());
app.use(passport.session());

const API_KEY = process.env.API_KEY;

// 5. Configurando a Estratégia da Steam
passport.use(new SteamStrategy({
    returnURL: `http://localhost:${port}/auth/steam/return`,
    realm: `http://localhost:${port}/`,
    apiKey: API_KEY
  },
  function(identifier, profile, done) {
    // O login deu certo! O profile tem os dados do jogador
    return done(null, profile);
  }
));

// 6. Serialização (Salva o usuário na sessão)
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});


// ==========================================
// ROTAS DE AUTENTICAÇÃO (PASSPORT)
// ==========================================

// Rota que o React chama para iniciar o login (via window.location.href)
app.get('/auth/steam', passport.authenticate('steam'));

// Rota de retorno após o usuário colocar a senha no site da Steam
app.get('/auth/steam/return', 
    passport.authenticate('steam', { failureRedirect: URL_REACT }),
    (req, res) => {
        // Deu certo! Manda de volta pro React
        res.redirect(URL_REACT); 
    }
);

// Rota para o React saber quem está logado
app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: "Usuário não autenticado" });
    }
});


// ==========================================
// SUAS ROTAS ORIGINAIS
// ==========================================

app.get("/dados/jogo", async (req, res) => {
    try{
        const response = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=105600`)
        res.json(response.data)
    } catch (error){
        console.error(error); // Adicionado para ajudar a debugar se der erro
        res.status(500).json({ error: "Erro pegando os dados da steam"})
    }
});


app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});