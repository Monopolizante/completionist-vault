/* o nome da database tem que ser completionistVault */

CREATE TABLE IF NOT EXISTS vault_accounts(
	steam_id BIGINT PRIMARY KEY NOT NULL UNIQUE,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL 
); 

CREATE TABLE IF NOT EXISTS categoria_platina (
	steam_id BIGINT REFERENCES vault_accounts(steam_id),
	app_id BIGINT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categoria_favoritos (
	steam_id BIGINT REFERENCES vault_accounts(steam_id),
	app_id BIGINT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categoria_zerados (
	steam_id BIGINT REFERENCES vault_accounts(steam_id),
	app_id BIGINT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categoria_jogando (
	steam_id BIGINT REFERENCES vault_accounts(steam_id),
	app_id BIGINT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categoria_proximo_jogos (
	steam_id BIGINT REFERENCES vault_accounts(steam_id),
	app_id BIGINT NOT NULL UNIQUE
);