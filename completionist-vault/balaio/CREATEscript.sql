/* o nome da database tem que ser completionistVault */

CREATE TABLE IF NOT EXISTS vault_accounts(
	steam_id BIGINT PRIMARY KEY NOT NULL UNIQUE
); 

CREATE TABLE IF NOT EXISTS categorias_accounts(
	id_categoria SERIAL NOT NULL UNIQUE PRIMARY KEY,
	nome_categoria TEXT NOT NULL,
	steam_id BIGINT REFERENCES vault_accounts(steam_id) NOT NULL
);

CREATE TABLE IF NOT EXISTS jogos_categorias(
	app_id BIGINT NOT NULL UNIQUE PRIMARY KEY,
	id_categoria INT REFERENCES categorias_accounts(id_categoria)
);