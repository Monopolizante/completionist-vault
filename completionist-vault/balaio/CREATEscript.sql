/* o nome da database tem que ser completionistVault */

CREATE TABLE IF NOT EXISTS vault_accounts(
	steam_id BIGINT PRIMARY KEY NOT NULL UNIQUE
); 

/* CREATE TABLE IF NOT EXISTS categorias_accounts(
	id_categoria SERIAL NOT NULL UNIQUE PRIMARY KEY,
	nome_categoria TEXT NOT NULL,
	steam_id BIGINT REFERENCES vault_accounts(steam_id) NOT NULL
);

CREATE TABLE IF NOT EXISTS jogos_categorias(
	app_id BIGINT NOT NULL UNIQUE PRIMARY KEY,
	id_categoria INT REFERENCES categorias_accounts(id_categoria)
); */


CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    steam_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_categories_vault_account
        FOREIGN KEY (steam_id)
        REFERENCES vault_accounts(steam_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category_games (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    appid INTEGER NOT NULL,
    game_name VARCHAR(255) NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_category_games_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_category_game
        UNIQUE (category_id, appid)
);

CREATE INDEX IF NOT EXISTS idx_categories_steam_id
    ON categories(steam_id);

CREATE INDEX IF NOT EXISTS idx_category_games_category_id
    ON category_games(category_id);