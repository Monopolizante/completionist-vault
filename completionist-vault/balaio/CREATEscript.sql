/* o nome da database tem que ser completionistVault */

CREATE TABLE IF NOT EXISTS vault_accounts(
	steam_id BIGINT PRIMARY KEY NOT NULL UNIQUE,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL
); 

CREATE TABLE IF NOT EXISTS vault_profiles(
	steam_id BIGINT REFERENCES vault_accounts(steam_id),
	numJogo INT NOT NULL DEFAULT 0,
	numConquistas INT NOT NULL DEFAULT 0,
	numHorasJogadas REAL NOT NULL DEFAULT 0.00,
	vaultPoints INT NOT NULL DEFAULT 0
);