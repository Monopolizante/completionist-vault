import express from "express";
import axios from "axios";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import pg from "pg"
import bcrypt from "bcrypt"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { Strategy as SteamStrategy } from "passport-steam";

const port = 3000; // Porta do Backend
const URL_REACT = "http://localhost:5173"; // MUDE ISSO para a porta que o seu React estiver rodando
const app = express();
const saltRounds = 10

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

const db = new pg.Client({
  user:"postgres",
  database: "completionistVault",
  password:process.env.DATABASE_PASSWORD,
  port: 5432
})

db.connect() 

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
    // Deu certo! Manda de volta pro React (Agora manda para o /Games. Luca esteve Aqui)
    res.redirect(`${URL_REACT}/Games`);
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
app.get("/dados/user/jogos/:id", isAuthenticated, async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.user;
    const steamResponse = await axios.get(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${id}&format=json&include_appinfo=true&include_played_free_games=true`,
    );

    // Pega a lista original de jogos retornada pela Steam
    const listaJogos = steamResponse.data.response?.games || [];

    // Mapeia os jogos buscando as conquistas de forma paralela e segura
    const jogosComConquistas = await Promise.all(
      listaJogos.map(async (jogo) => {
        // Se o usuário nunca jogou o título, não gasta requisição com a API
        if (jogo.playtime_forever === 0) {
          return { ...jogo, has_achievements: false, unlocked: 0, total: 0, pct: 0 };
        }

        try {
          // Busca o status atualizado de conquistas do usuário para este AppID
          const playerAchievementsUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${jogo.appid}&key=${API_KEY}&steamid=${id}`;
          const playerRes = await axios.get(playerAchievementsUrl);
          const achievements = playerRes.data.playerstats.achievements || [];

          if (achievements.length > 0) {
            const unlocked = achievements.filter(a => a.achieved === 1).length;
            const total = achievements.length;
            const pct = Math.round((unlocked / total) * 100);

            return {
              ...jogo,
              has_achievements: true,
              unlocked: unlocked,
              total: total,
              pct: pct
            };
          }
        } catch (err) {
          // Ignora erros caso o jogo não possua suporte oficial a conquistas na API
        }

        return { ...jogo, has_achievements: false, unlocked: 0, total: 0, pct: 0 };
      })
    );

    res.setHeader("Content-Type", "application/json");
    res.json({
      infoUsuario: userData._json,
      jogosUsuario: {
        response: {
          games: jogosComConquistas
        }
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno ao processar a biblioteca com conquistas." });
  }
});
// =========================================================================
// NOVA ROTA: OBTENÇÃO DINÂMICA DE CONQUISTAS DO JOGO POR USUÁRIO
// =========================================================================
app.get("/dados/user/jogos/:id/conquistas/:appId", isAuthenticated, async (req, res) => {
  try {
    const { id, appId } = req.params;

    // 1. Busca quais conquistas o jogador específico desbloqueou e a data
    const playerAchievementsUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${API_KEY}&steamid=${id}&l=brazilian`;
    const playerRes = await axios.get(playerAchievementsUrl);
    const playerStats = playerRes.data.playerstats;

    // 2. Busca o Schema do Jogo para pegar títulos amigáveis, descrições e ícones das conquistas
    const gameSchemaUrl = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${appId}&l=brazilian`;
    const schemaRes = await axios.get(gameSchemaUrl);
    const gameSchema = schemaRes.data.game.availableGameStats?.achievements || [];

    // Mapeia e cruza as conquistas do jogador com os detalhes globais do Schema
    const achievementsFormatted = gameSchema.map((sch, index) => {
      const playerAch = playerStats.achievements?.find(a => a.apiname === sch.name);
      
      // Formata a data se estiver desbloqueada
      let formattedDate = null;
      if (playerAch?.unlocktime) {
        const dateObj = new Date(playerAch.unlocktime * 1000);
        formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
      }

      // Determinação simples de raridade com base nas regras existentes no frontend
      let rarity = "common";
      if (index % 4 === 0) rarity = "legendary";
      else if (index % 3 === 0) rarity = "epic";
      else if (index % 2 === 0) rarity = "rare";

      return {
        id: index + 1,
        name: sch.displayName || sch.name,
        desc: sch.description || "Conquista Secreta",
        iconUrl: sch.icon,
        rarity: rarity,
        unlocked: playerAch ? playerAch.achieved === 1 : false,
        date: formattedDate
      };
    });

    res.json({
      name: playerStats.gameName,
      imageIcon: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`,
      heroBg: "linear-gradient(160deg, #0a1118, #1c242e)",
      accentColor: "#f5c518",
      platform: "Steam",
      achievements: achievementsFormatted
    });

  } catch (error) {
    console.error("Erro ao buscar conquistas na API da Steam:", error.message);
    res.status(500).json({ error: "Erro ao obter conquistas da Steam" });
  }
});

app.post("/cadastro", (req, res) => {
  console.log(req.user)
  const email = req.body.email 
  const senhaCrua = req.body.senha
  try {
    bcrypt.hash(senhaCrua, saltRounds, (err, hashedPassword) => {
      db.query("INSERT INTO vault-accounts")
    })
  } catch (error) {
    
  }
})


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