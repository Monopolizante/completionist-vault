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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { Strategy as SteamStrategy } from "passport-steam";

const port = 3000; // Porta do Backend
const URL_REACT = "http://localhost:5173"; // MUDE ISSO para a porta que o seu React estiver rodando
const app = express();
const saltRounds = 10;
const portaAPI = 3000;
let hasVaultAccount = false;

// 2. Ajuste CRÍTICO no CORS para permitir o envio de cookies de sessão
app.use(
  cors({
    origin: URL_REACT,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  user: "postgres",
  database: "completionistVault",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

db.connect()
  .then(() => initializeCategoryTables())
  .catch((error) => console.error("Erro ao conectar/inicializar PostgreSQL:", error));

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
  async (req, res) => {
    // Deu certo! Manda de volta pro React (Agora manda para o /Games. Luca esteve Aqui)
    const userId = req.user._json.steamid;
    try {
      const result = await db.query("SELECT * FROM vault_accounts WHERE steam_id = $1", [userId]);
      if (result.rows.length > 0) {
        console.log("Usuário já cadastrado, redirecionando..")
      } else {
        await db.query("INSERT INTO vault_accounts VALUES ($1)", [userId]);
      }
      res.redirect(`${URL_REACT}/Games`);
    } catch (error) {
      console.log(error);
      res.redirect(`${URL_REACT}/Games`);
    }
  },
);

// -----Rota para o React saber quem está logado
//---- Primeira Versão sem VaultAccount
app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Usuário não autenticado" });
  }
});

// ---Rota para Logout
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          error: "Erro ao encerrar a sessão",
        });
      }

      res.clearCookie("connect.sid");

      return res.status(200).json({
        message: "Logout realizado com sucesso",
      });
    });
  });
});

// ==========================================
// SUAS ROTAS ORIGINAIS
// ==========================================
app.get("/dados/user/jogos/:id", isAuthenticated, async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.user;
    const jogosComConquistas = await pegarDados(id);
    // Mapeia os jogos buscando as conquistas de forma paralela e segura;

    console.log(`Tem a vaultAccount?${hasVaultAccount}`);
    res.setHeader("Content-Type", "application/json");
    res.json({
      infoUsuario: userData._json,
      jogosUsuario: {
        response: {
          games: jogosComConquistas,
        },
        vaultAccount: hasVaultAccount,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Erro interno ao processar a biblioteca com conquistas.",
      });
  }
});
// =========================================================================
// NOVA ROTA: OBTENÇÃO DINÂMICA DE CONQUISTAS DO JOGO POR USUÁRIO
// =========================================================================
app.get(
  "/dados/user/jogos/:id/conquistas/:appId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { id, appId } = req.params;

      // 1. Busca quais conquistas o jogador específico desbloqueou e a data
      const playerAchievementsUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${API_KEY}&steamid=${id}&l=brazilian`;
      const playerRes = await axios.get(playerAchievementsUrl);
      const playerStats = playerRes.data.playerstats;

      // 2. Busca o Schema do Jogo para pegar títulos amigáveis, descrições e ícones das conquistas
      const gameSchemaUrl = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${appId}&l=brazilian`;
      const schemaRes = await axios.get(gameSchemaUrl);
      const gameSchema =
        schemaRes.data.game.availableGameStats?.achievements || [];

      // Mapeia e cruza as conquistas do jogador com os detalhes globais do Schema
      const achievementsFormatted = gameSchema.map((sch, index) => {
        const playerAch = playerStats.achievements?.find(
          (a) => a.apiname === sch.name,
        );

        // Formata a data se estiver desbloqueada
        let formattedDate = null;
        if (playerAch?.unlocktime) {
          const dateObj = new Date(playerAch.unlocktime * 1000);
          formattedDate = dateObj.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
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
        vaultAccount: hasVaultAccount,
      });
    } catch (error) {
      console.error(
        "Erro ao buscar conquistas na API da Steam:",
        error.message,
      );
      res.status(500).json({ error: "Erro ao obter conquistas da Steam" });
    }
  },
);


// ==========================================
// CRUD DE CATEGORIAS (POSTGRESQL)
// ==========================================
const getLoggedSteamId = (req) =>
  req.user?._json?.steamid || req.user?.id || req.user?.steamid;

async function initializeCategoryTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      steam_id BIGINT NOT NULL,
      name VARCHAR(60) NOT NULL,
      description VARCHAR(180) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_categories_vault_account
        FOREIGN KEY (steam_id) REFERENCES vault_accounts(steam_id) ON DELETE CASCADE,
      CONSTRAINT uq_category_name_per_user UNIQUE (steam_id, name)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS category_games (
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      app_id BIGINT NOT NULL,
      game_name VARCHAR(160) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (category_id, app_id)
    )
  `);
}

async function listCategories(steamId) {
  const result = await db.query(
    `SELECT
       c.id,
       c.name,
       c.description,
       c.created_at,
       c.updated_at,
       COALESCE(
         json_agg(
           json_build_object('appId', cg.app_id, 'name', cg.game_name)
           ORDER BY cg.game_name
         ) FILTER (WHERE cg.app_id IS NOT NULL),
         '[]'::json
       ) AS games
     FROM categories c
     LEFT JOIN category_games cg ON cg.category_id = c.id
     WHERE c.steam_id = $1
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [steamId],
  );
  return result.rows;
}

async function getOwnedCategory(categoryId, steamId) {
  const result = await db.query(
    "SELECT id FROM categories WHERE id = $1 AND steam_id = $2",
    [categoryId, steamId],
  );
  return result.rows[0];
}

app.get("/api/categories", isAuthenticated, async (req, res) => {
  try {
    res.json(await listCategories(getLoggedSteamId(req)));
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    res.status(500).json({ error: "Não foi possível carregar as categorias." });
  }
});

app.post("/api/categories", isAuthenticated, async (req, res) => {
  const steamId = getLoggedSteamId(req);
  const name = String(req.body.name || "").trim();
  const description = String(req.body.description || "").trim();

  if (name.length < 2 || name.length > 60) {
    return res.status(400).json({ error: "O nome deve ter entre 2 e 60 caracteres." });
  }
  if (description.length > 180) {
    return res.status(400).json({ error: "A descrição deve ter no máximo 180 caracteres." });
  }

  try {
    const result = await db.query(
      `INSERT INTO categories (steam_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, created_at, updated_at`,
      [steamId, name, description],
    );
    res.status(201).json({ ...result.rows[0], games: [] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Você já possui uma categoria com esse nome." });
    }
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ error: "Não foi possível criar a categoria." });
  }
});

app.put("/api/categories/:id", isAuthenticated, async (req, res) => {
  const steamId = getLoggedSteamId(req);
  const name = String(req.body.name || "").trim();
  const description = String(req.body.description || "").trim();

  if (name.length < 2 || name.length > 60 || description.length > 180) {
    return res.status(400).json({ error: "Revise o nome e a descrição da categoria." });
  }

  try {
    const result = await db.query(
      `UPDATE categories
       SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND steam_id = $4
       RETURNING id, name, description, created_at, updated_at`,
      [name, description, req.params.id, steamId],
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Categoria não encontrada." });

    const categories = await listCategories(steamId);
    res.json(categories.find((category) => category.id === result.rows[0].id));
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Você já possui uma categoria com esse nome." });
    }
    console.error("Erro ao editar categoria:", error);
    res.status(500).json({ error: "Não foi possível editar a categoria." });
  }
});

app.delete("/api/categories/:id", isAuthenticated, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM categories WHERE id = $1 AND steam_id = $2 RETURNING id",
      [req.params.id, getLoggedSteamId(req)],
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Categoria não encontrada." });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao apagar categoria:", error);
    res.status(500).json({ error: "Não foi possível apagar a categoria." });
  }
});

app.post("/api/categories/:id/games", isAuthenticated, async (req, res) => {
  const steamId = getLoggedSteamId(req);
  const appId = Number(req.body.appId);
  const gameName = String(req.body.gameName || "").trim();

  if (!Number.isSafeInteger(appId) || appId <= 0 || !gameName) {
    return res.status(400).json({ error: "Jogo inválido." });
  }

  try {
    if (!(await getOwnedCategory(req.params.id, steamId))) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }
    await db.query(
      `INSERT INTO category_games (category_id, app_id, game_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (category_id, app_id)
       DO UPDATE SET game_name = EXCLUDED.game_name`,
      [req.params.id, appId, gameName],
    );
    const categories = await listCategories(steamId);
    res.json(categories.find((category) => category.id === Number(req.params.id)));
  } catch (error) {
    console.error("Erro ao adicionar jogo à categoria:", error);
    res.status(500).json({ error: "Não foi possível adicionar o jogo." });
  }
});

app.delete("/api/categories/:id/games/:appId", isAuthenticated, async (req, res) => {
  const steamId = getLoggedSteamId(req);
  try {
    if (!(await getOwnedCategory(req.params.id, steamId))) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }
    await db.query(
      "DELETE FROM category_games WHERE category_id = $1 AND app_id = $2",
      [req.params.id, req.params.appId],
    );
    const categories = await listCategories(steamId);
    res.json(categories.find((category) => category.id === Number(req.params.id)));
  } catch (error) {
    console.error("Erro ao remover jogo da categoria:", error);
    res.status(500).json({ error: "Não foi possível remover o jogo." });
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

async function pegarDados(id) {
  const steamResponse = await axios.get(
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${id}&format=json&include_appinfo=true&include_played_free_games=true`,
  );

  // Pega a lista original de jogos retornada pela Steam
  const listaJogos = steamResponse.data.response?.games || [];
  const jogosComConquistas = await Promise.all(
    listaJogos.map(async (jogo) => {
      // Se o usuário nunca jogou o título, não gasta requisição com a API
      if (jogo.playtime_forever === 0) {
        return {
          ...jogo,
          has_achievements: false,
          unlocked: 0,
          total: 0,
          pct: 0,
        };
      }

      try {
        // Busca o status atualizado de conquistas do usuário para este AppID
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
            vaultAccount: hasVaultAccount,
          };
        }
      } catch (err) {
        // Ignora erros caso o jogo não possua suporte oficial a conquistas na API
      }

      return {
        ...jogo,
        has_achievements: false,
        unlocked: 0,
        total: 0,
        pct: 0,
      };
    }),
  );
  return jogosComConquistas;
}

async function calcularStats(listaJogos) {
  const totalPlatinados = listaJogos.filter(
    (g) => g.total > 0 && g.unlocked === g.total,
  ).length;
  const totalJogos = listaJogos.length;
  //Cálculo de conquistas totais
  const totalUnlocked = listaJogos.reduce(
    (acc, g) => acc + (g.unlocked || 0),
    0,
  );
  const totalAchievementsPossiveis = listaJogos.reduce(
    (acc, g) => acc + (g.total || 0),
    0,
  );

  //Cálculo de horas totais
  const totalHoras = listaJogos.reduce((acc, g) => {
    // Ajeita o 'playtime_forever' que API envia em minutos, converte para horas dividindo por 60
    const horasNumero = g.playtime_forever
      ? Math.floor(g.playtime_forever / 60)
      : 0;
    return acc + horasNumero;
  }, 0);
  const totalPoints = (totalUnlocked + totalHoras) * 2.5;
  const response = {
    totalPlatinados: totalPlatinados,
    totalUnlocked: totalUnlocked,
    totalAchievementsPossiveis: totalAchievementsPossiveis,
    totalHoras: totalHoras,
    totalJogos: totalJogos,
    totalPoint: totalPoints,
  };
  return response;
}

// Middleware to protect API routes
