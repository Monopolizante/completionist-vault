import express from "express";
import axios from "axios";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import pg from "pg";
import bcrypt from "bcrypt";
import { Strategy as SteamStrategy } from "passport-steam";
import { Await } from "react-router";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const port = 3000;
const URL_REACT = "http://localhost:5173";
const saltRounds = 10;
const API_KEY = process.env.API_KEY;

const app = express();

// ==========================================
// CONFIGURAÇÕES GERAIS
// ==========================================

app.use(
  cors({
    origin: URL_REACT,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Necessário para ler req.body em requisições POST com JSON

app.use(
  session({
    secret: process.env.SESSION_SECRET || "uma_chave_secreta_qualquer_para_testes",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false, // true em produção com HTTPS
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ==========================================
// BANCO DE DADOS
// ==========================================

const db = new pg.Client({
  user: "postgres",
  database: "completionistVault",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

db.connect().catch((err) => console.error("Erro ao conectar no banco:", err));

// ==========================================
// ESTRATÉGIA STEAM & MIDDLEWARES
// ==========================================

passport.use(
  new SteamStrategy(
    {
      returnURL: `http://localhost:${port}/auth/steam/return`,
      realm: `http://localhost:${port}/`,
      apiKey: API_KEY,
    },
    (identifier, profile, done) => {
      console.log(`Login Steam bem-sucedido para: ${profile.displayName}`);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

const isAuthenticated = (req, res, next) => {
  // Verifica tanto o login da Steam quanto o login customizado do Vault
  if (req.isAuthenticated() || req.session.hasVaultAccount) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized: Please log in first." });
};

// ==========================================
// ROTAS DE AUTENTICAÇÃO
// ==========================================

app.get("/auth/steam", passport.authenticate("steam"));

app.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: URL_REACT }),
  (req, res) => {
    res.redirect(`${URL_REACT}/Games`);
  }
);

app.get("/api/user", (req, res) => {
  if (req.session.hasVaultAccount) {
    const personaData = await getPersona(req.session.vault_id)
    res.json({ steamId: req.session.vault_id, personaInfo: personaData, isVault: true });
  } else if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Usuário não autenticado" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao encerrar a sessão" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout realizado com sucesso" });
    });
  });
});



// ==========================================
// ROTAS DE DADOS (JOGOS E CONQUISTAS)
// ==========================================

app.get("/dados/user/jogos/:id", isAuthenticated, async (req, res) => {
  try {
    const id = req.session.vault_id || req.params.id;
    const infoUser = await getPersona(id)
    console.log(infoUser.personaInfo.personaname)
    const userData = req.session.vault_id ? { persona: infoUser.personaInfo.personaname, steamid: req.session.vault_id } : req.user._json;
    
    const jogosComConquistas = await pegarDados(id);

    res.json({
      infoUsuario: userData,
      jogosUsuario: {
        response: {
          games: jogosComConquistas,
        },
        vaultAccount: req.session.hasVaultAccount || false,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno ao processar a biblioteca." });
  }
});

app.get("/dados/user/jogos/:id/conquistas/:appId", isAuthenticated, async (req, res) => {
  try {
    const id = req.session.vault_id || req.params.id;
    const appId = req.params.appId;

    const playerAchievementsUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${API_KEY}&steamid=${id}&l=brazilian`;
    const playerRes = await axios.get(playerAchievementsUrl);
    const playerStats = playerRes.data.playerstats;

    const gameSchemaUrl = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${appId}&l=brazilian`;
    const schemaRes = await axios.get(gameSchemaUrl);
    const gameSchema = schemaRes.data.game.availableGameStats?.achievements || [];

    const achievementsFormatted = gameSchema.map((sch, index) => {
      const playerAch = playerStats.achievements?.find((a) => a.apiname === sch.name);
      
      let formattedDate = null;
      if (playerAch?.unlocktime) {
        const dateObj = new Date(playerAch.unlocktime * 1000);
        formattedDate = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
      }

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
        date: formattedDate,
      };
    });

    res.json({
      name: playerStats.gameName,
      imageIcon: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`,
      heroBg: "linear-gradient(160deg, #0a1118, #1c242e)",
      accentColor: "#f5c518",
      platform: "Steam",
      achievements: achievementsFormatted,
      vaultAccount: req.session.hasVaultAccount || false,
    });
  } catch (error) {
    console.error("Erro ao buscar conquistas:", error.message);
    res.status(500).json({ error: "Erro ao obter conquistas da Steam" });
  }
});

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

async function pegarDados(id) {
  const steamResponse = await axios.get(
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${id}&format=json&include_appinfo=true&include_played_free_games=true`
  );
  const listaJogos = steamResponse.data.response?.games || [];
  const vaultStatus = await checarConta(id);

  const jogosComConquistas = await Promise.all(
    listaJogos.map(async (jogo) => {
      if (jogo.playtime_forever === 0) {
        return { ...jogo, has_achievements: false, unlocked: 0, total: 0, pct: 0 };
      }

      try {
        const playerAchievementsUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${jogo.appid}&key=${API_KEY}&steamid=${id}`;
        const playerRes = await axios.get(playerAchievementsUrl);
        const achievements = playerRes.data.playerstats.achievements || [];

        if (achievements.length > 0) {
          const unlocked = achievements.filter((a) => a.achieved === 1).length;
          const total = achievements.length;
          const pct = Math.round((unlocked / total) * 100);

          return {
            ...jogo,
            has_achievements: true,
            unlocked: unlocked,
            total: total,
            pct: pct,
            vaultAccount: vaultStatus
          };
        }
      } catch (err) {
        // Ignora erros de jogos sem conquistas
      }
      return { ...jogo, has_achievements: false, unlocked: 0, total: 0, pct: 0 };
    })
  );
  return jogosComConquistas;
}

async function calcularStats(listaJogos) {
  const totalPlatinados = listaJogos.filter((g) => g.total > 0 && g.unlocked === g.total).length;
  const totalJogos = listaJogos.length;
  const totalUnlocked = listaJogos.reduce((acc, g) => acc + (g.unlocked || 0), 0);
  const totalAchievementsPossiveis = listaJogos.reduce((acc, g) => acc + (g.total || 0), 0);
  
  const totalHoras = listaJogos.reduce((acc, g) => {
    return acc + (g.playtime_forever ? Math.floor(g.playtime_forever / 60) : 0);
  }, 0);

  const totalPoints = (totalUnlocked + totalHoras) * 2.5;
  
  return {
    totalPlatinados,
    totalUnlocked,
    totalAchievementsPossiveis,
    totalHoras,
    totalJogos,
    totalPoint: totalPoints,
  };
}

async function checarConta(id) {
  try {
    const result = await db.query("SELECT steam_id FROM vault_accounts WHERE steam_id = $1", [id]);
    return { existe: result.rows.length > 0, steam_id: id };
  } catch (err) {
    console.error(`Erro na checagem de conta: ${err}`);
    return { existe: false, steam_id: null };
  }
}

async function getPersona(id){
  const userData = await axios.get(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${id}`
  )
  return {personaInfo: userData.data.response.players[0]}
}
// ==========================================
// INICIALIZAÇÃO
// ==========================================

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`API KEY carregada?`, process.env.API_KEY ? "Sim" : "Não");
});