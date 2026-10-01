CREATE TABLE IF NOT EXISTS users (
    id varchar(36) PRIMARY KEY,
    nome text NOT NULL,
    email text UNIQUE NOT NULL,
    senha_hash text NOT NULL,
    telefone text,
    data_nascimento date,
    avatar_url text,
    tipo_sanguineo text,
    alergias text,
    medicamentos_em_uso text,
    plano_de_saude text,
    email_verificado boolean NOT NULL DEFAULT false,
    contato_emergencia_nome text,
    contato_emergencia_telefone text,
    contato_emergencia_parentesco text,
    push_token text
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS data_nascimento date;
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token text;

CREATE TABLE IF NOT EXISTS auth_tokens (
    token_hash varchar(64) PRIMARY KEY,
    user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_type varchar(16) NOT NULL CHECK (token_type IN ('access', 'refresh')),
    expires_at timestamptz NOT NULL,
    revoked boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user ON auth_tokens(user_id);

CREATE TABLE IF NOT EXISTS password_reset_codes (
    code_hash varchar(64) PRIMARY KEY,
    user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL,
    used boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS establishments (
    id text PRIMARY KEY,
    nome text NOT NULL,
    tipo text NOT NULL,
    endereco text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    status text NOT NULL DEFAULT 'aberto'
);

CREATE TABLE IF NOT EXISTS first_aid_guides (
    id text PRIMARY KEY,
    titulo text NOT NULL,
    resumo text NOT NULL,
    icon text NOT NULL,
    passos text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS appointments (
    id varchar(36) PRIMARY KEY,
    user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    establishment_id text NOT NULL REFERENCES establishments(id),
    especialidade text NOT NULL,
    data date NOT NULL,
    horario time NOT NULL,
    status text NOT NULL DEFAULT 'agendado',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_appointments_user_date ON appointments(user_id, data, horario);

CREATE TABLE IF NOT EXISTS favorites (
    user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    establishment_id text NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, establishment_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id varchar(36) PRIMARY KEY,
    user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titulo text NOT NULL,
    descricao text NOT NULL,
    lida boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_date ON notifications(user_id, created_at DESC);
