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
    push_token text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS senha_hash text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS telefone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_nascimento date;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS tipo_sanguineo text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS alergias text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS medicamentos_em_uso text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plano_de_saude text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verificado boolean;
ALTER TABLE users ADD COLUMN IF NOT EXISTS contato_emergencia_nome text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS contato_emergencia_telefone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS contato_emergencia_parentesco text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at timestamptz;

UPDATE users SET
    senha_hash = COALESCE(to_jsonb(users)->>'senhaHash', senha_hash),
    telefone = COALESCE(to_jsonb(users)->>'telefone', telefone),
    data_nascimento = COALESCE(NULLIF(to_jsonb(users)->>'dataNascimento', '')::date, data_nascimento),
    avatar_url = COALESCE(to_jsonb(users)->>'avatarUrl', avatar_url),
    tipo_sanguineo = COALESCE(to_jsonb(users)->>'tipoSanguineo', tipo_sanguineo),
    alergias = COALESCE(to_jsonb(users)->>'alergias', alergias),
    medicamentos_em_uso = COALESCE(to_jsonb(users)->>'medicamentosEmUso', medicamentos_em_uso),
    plano_de_saude = COALESCE(to_jsonb(users)->>'planoDeSaude', plano_de_saude),
    email_verificado = COALESCE(NULLIF(to_jsonb(users)->>'emailVerificado', '')::boolean, email_verificado, false),
    contato_emergencia_nome = COALESCE(to_jsonb(users)->>'contatoEmergenciaNome', contato_emergencia_nome),
    contato_emergencia_telefone = COALESCE(to_jsonb(users)->>'contatoEmergenciaTelefone', contato_emergencia_telefone),
    contato_emergencia_parentesco = COALESCE(to_jsonb(users)->>'contatoEmergenciaParentesco', contato_emergencia_parentesco),
    created_at = COALESCE(NULLIF(to_jsonb(users)->>'createdAt', '')::timestamptz, created_at, now()),
    updated_at = COALESCE(NULLIF(to_jsonb(users)->>'updatedAt', '')::timestamptz, updated_at, now());

ALTER TABLE users ALTER COLUMN email_verificado SET DEFAULT false;
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT now();
UPDATE users SET email_verificado = false WHERE email_verificado IS NULL;
UPDATE users SET created_at = now() WHERE created_at IS NULL;
UPDATE users SET updated_at = now() WHERE updated_at IS NULL;
ALTER TABLE users ALTER COLUMN email_verificado SET NOT NULL;
ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;

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
    passos text[] NOT NULL DEFAULT '{}',
    ordem integer NOT NULL DEFAULT 0
);
ALTER TABLE first_aid_guides ADD COLUMN IF NOT EXISTS ordem integer NOT NULL DEFAULT 0;

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
ALTER TABLE favorites ADD COLUMN IF NOT EXISTS user_id varchar(36);
ALTER TABLE favorites ADD COLUMN IF NOT EXISTS establishment_id text;
ALTER TABLE favorites ADD COLUMN IF NOT EXISTS created_at timestamptz;

UPDATE favorites SET
    user_id = COALESCE(to_jsonb(favorites)->>'userId', user_id),
    establishment_id = COALESCE(to_jsonb(favorites)->>'establishmentId', establishment_id),
    created_at = COALESCE(NULLIF(to_jsonb(favorites)->>'createdAt', '')::timestamptz, created_at, now());

ALTER TABLE favorites ALTER COLUMN created_at SET DEFAULT now();
UPDATE favorites SET created_at = now() WHERE created_at IS NULL;
ALTER TABLE favorites ALTER COLUMN created_at SET NOT NULL;

CREATE TABLE IF NOT EXISTS notifications (
    id varchar(36) PRIMARY KEY,
    user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    icon text NOT NULL DEFAULT 'notifications',
    titulo text NOT NULL,
    descricao text NOT NULL,
    lida boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS user_id varchar(36);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS icon text;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS titulo text;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS descricao text;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS lida boolean;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS created_at timestamptz;

UPDATE notifications SET
    user_id = COALESCE(to_jsonb(notifications)->>'userId', user_id),
    created_at = COALESCE(NULLIF(to_jsonb(notifications)->>'createdAt', '')::timestamptz, created_at, now()),
    icon = COALESCE(icon, 'notifications'),
    lida = COALESCE(lida, false);

ALTER TABLE notifications ALTER COLUMN icon SET DEFAULT 'notifications';
ALTER TABLE notifications ALTER COLUMN lida SET DEFAULT false;
ALTER TABLE notifications ALTER COLUMN created_at SET DEFAULT now();
UPDATE notifications SET created_at = now() WHERE created_at IS NULL;
ALTER TABLE notifications ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE notifications ALTER COLUMN icon SET NOT NULL;
ALTER TABLE notifications ALTER COLUMN lida SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_user_date ON notifications(user_id, created_at DESC);
