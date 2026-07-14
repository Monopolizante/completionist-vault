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
    name VARCHAR(60) NOT NULL,
    description VARCHAR(180) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categories_vault_account
        FOREIGN KEY (steam_id)
        REFERENCES vault_accounts(steam_id)
        ON DELETE CASCADE,
    CONSTRAINT uq_category_name_per_user UNIQUE (steam_id, name)
);

CREATE TABLE IF NOT EXISTS category_games (
    category_id INTEGER NOT NULL,
    app_id BIGINT NOT NULL,
    game_name VARCHAR(160) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (category_id, app_id),
    CONSTRAINT fk_category_games_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_categories_steam_id ON categories(steam_id);
CREATE INDEX IF NOT EXISTS idx_category_games_category_id ON category_games(category_id);