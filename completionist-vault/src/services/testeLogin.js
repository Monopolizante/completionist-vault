import express from "express";
import axios from "axios";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { Strategy as SteamStrategy } from "passport-steam";

const port = 3000; // Porta do Backend
const URL_REACT = "http://localhost:5173"; // MUDE ISSO para a porta que o seu React estiver rodando
const app = express();

// 2. Ajuste CRÍTICO no CORS para permitir o envio de cookies de sessão
app.use(
  cors({
    origin: URL_REACT,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));

// 3. Configurando a Sessão (Obrigatório para o Passport funcionar)
// Inicializa a sessão e configura o comportamento dos cookies
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "uma_chave_secreta_qualquer_para_testes",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Cookie lasts 1 day
      secure: false, // MUST be false for http://localhost (no HTTPS)
      httpOnly: true, // Prevents client-side JS scripts from hijacking it
    },
  }),
);

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is logged in, proceed to the route handler
  }
  // User is not logged in, send an unauthorized error
  res.status(401).json({ error: "Unauthorized: Please log in first." });
};

// 4. Inicializando o Passport
app.use(passport.initialize());
app.use(passport.session());

const API_KEY = process.env.API_KEY;

// 5. Configurando a Estratégia da Steam
passport.use(
  new SteamStrategy(
    {
      returnURL: `http://localhost:${port}/auth/steam/return`,
      realm: `http://localhost:${port}/`,
      apiKey: API_KEY,
    },
    function (identifier, profile, done) {
      // O login deu certo! O profile tem os dados do jogador
      console.log(
        `retorno da conversa com a steam com o passport ${profile.displayName}`,
      );
      return done(null, profile);
    },
  ),
);

// 6. Serialização (Salva o usuário na sessão)

// ==========================================
// ROTAS DE AUTENTICAÇÃO (PASSPORT)
// ==========================================

// Rota que o React chama para iniciar o login (via window.location.href)
app.get("/auth/steam", passport.authenticate("steam"));

// Rota de retorno após o usuário colocar a senha no site da Steam
app.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: URL_REACT }),
  (req, res) => {
    // Deu certo! Manda de volta pro React
    res.redirect(URL_REACT);
  },
);

// Rota para o React saber quem está logado
app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Usuário não autenticado" });
  }
});

// ==========================================
// SUAS ROTAS ORIGINAIS
// ==========================================

/* 
app.get("/dados/jogos", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${jogo}`,
    );
    res.json(response.data);
  } catch (error) {
    console.error(error); // Adicionado para ajudar a debugar se der erro
    res.status(500).json({ error: "Erro pegando os dados da steam" });
  }
}); 

TOTAL DE CONQUISTAS POR JOGO, ATÉ AGORA A ROTA NÃO É UTILIZADA
*/

app.get("/dados/user/jogos/:id", isAuthenticated, async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.user;
    const steamResponse = await axios.get(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${id}&format=json&include_appinfo=true&include_played_free_games=true`,
    );
    res.setHeader("Content-Type", "application/json");
    res.json({
      infoUsuario: userData._json,
      jogosUsuario: steamResponse.data,
    });
  } catch (error) {
    console.error(error);
  }
});


// ROTA TESTE 
app.get("/dados/user/info", isAuthenticated, async (req, res) => {
  try {
    const userId = req.query.id; //o front-end manda o id do user pra cá
    const response = await axios.get(
      `https://api.steampowered.com/IPlayerService/GetTopAchievementsForGames/v1/?key=${API_KEY}&steamid=${userId}&language=en&max_achievements=10000&appids[0]=550`,
    );
    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Did the API KEY load?`, process.env.API_KEY ? "yes" : "no");
});

// Middleware to protect API routes
