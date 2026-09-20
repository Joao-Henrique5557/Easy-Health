CREATE TABLE IF NOT EXISTS users(id varchar(36) PRIMARY KEY,nome text NOT NULL,email text UNIQUE NOT NULL,senha_hash text NOT NULL,telefone text,avatar_url text,tipo_sanguineo text,alergias text,medicamentos_em_uso text,plano_de_saude text,email_verificado boolean DEFAULT false,contato_emergencia_nome text,contato_emergencia_telefone text,contato_emergencia_parentesco text);
CREATE TABLE IF NOT EXISTS refresh_tokens(id serial PRIMARY KEY,token_hash text UNIQUE,user_id varchar(36) REFERENCES users(id) ON DELETE CASCADE,expires_at timestamp,revoked boolean DEFAULT false);
CREATE TABLE IF NOT EXISTS establishments(id text PRIMARY KEY,nome text,tipo text,endereco text,latitude float,longitude float,status text);
CREATE TABLE IF NOT EXISTS first_aid_guides(id text PRIMARY KEY,titulo text,resumo text,icon text,passos text[]);
ALTER TABLE users ADD COLUMN IF NOT EXISTS contato_emergencia_nome text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS contato_emergencia_telefone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS contato_emergencia_parentesco text;
