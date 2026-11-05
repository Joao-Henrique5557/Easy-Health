-- Banco principal do Easy Health.
-- Persistência própria do app. Catálogos de demonstração ficam fora deste banco:
-- instituições em 02_instituicoes_medicas.sql / 03_dados_exemplo_instituicoes.sql
-- primeiros socorros em frontend/src/data/firstAidGuides.json e a conta de
-- demonstração em 04_dados_exemplo_usuario.sql.

CREATE TABLE IF NOT EXISTS users (
    id varchar(36) PRIMARY KEY,
    nome text NOT NULL,
    email varchar(254) NOT NULL UNIQUE,
    senha_hash text NOT NULL,
    telefone varchar(64),
    data_nascimento date,
    avatar_url text,
    tipo_sanguineo varchar(8),
    alergias text,
    medicamentos_em_uso text,
    plano_de_saude text,
    email_verificado boolean NOT NULL DEFAULT false,
    contato_emergencia_nome text,
    contato_emergencia_telefone varchar(64),
    contato_emergencia_parentesco text,
    push_token text,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS auth_tokens (
    token_hash varchar(64) PRIMARY KEY,
    user_id varchar(36) NOT NULL,
    token_type varchar(16) NOT NULL,
    expires_at timestamp NOT NULL,
    revoked boolean NOT NULL DEFAULT false,
    KEY idx_auth_tokens_user (user_id),
    CONSTRAINT fk_auth_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_auth_tokens_type CHECK (token_type IN ('access', 'refresh'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS oauth_identities (
    provider varchar(32) NOT NULL,
    subject varchar(255) NOT NULL,
    user_id varchar(36) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (provider, subject),
    KEY idx_oauth_identities_user (user_id),
    CONSTRAINT fk_oauth_identities_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS password_reset_codes (
    code_hash varchar(64) PRIMARY KEY,
    user_id varchar(36) NOT NULL,
    expires_at timestamp NOT NULL,
    used boolean NOT NULL DEFAULT false,
    CONSTRAINT fk_password_reset_codes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS medical_history_records (
    id varchar(36) PRIMARY KEY,
    user_id varchar(36) NOT NULL,
    tipo varchar(24) NOT NULL,
    titulo varchar(180) NOT NULL,
    data date NOT NULL,
    descricao text,
    profissional varchar(180),
    local varchar(255),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_medical_history_user_date (user_id, data),
    CONSTRAINT fk_medical_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_medical_history_type CHECK (tipo IN ('exame', 'vacina', 'medicamento', 'documento'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS appointments (
    id varchar(36) PRIMARY KEY,
    user_id varchar(36) NOT NULL,
    establishment_id varchar(191) NOT NULL,
    especialidade varchar(255) NOT NULL,
    data date NOT NULL,
    horario time NOT NULL,
    status varchar(32) NOT NULL DEFAULT 'agendado',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_appointments_user_date (user_id, data, horario),
    CONSTRAINT fk_appointments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Linhas locais usadas para serializar reservas por estabelecimento sem
-- conceder permissões de escrita no schema de catálogo.
CREATE TABLE IF NOT EXISTS establishment_booking_locks (
    establishment_id varchar(191) PRIMARY KEY,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS favorites (
    user_id varchar(36) NOT NULL,
    establishment_id varchar(191) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, establishment_id),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS notifications (
    id varchar(36) PRIMARY KEY,
    user_id varchar(36) NOT NULL,
    icon varchar(64) NOT NULL DEFAULT 'notifications',
    titulo text NOT NULL,
    descricao text NOT NULL,
    lida boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_notifications_user_date (user_id, created_at),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volumes criados por versões anteriores mantinham estas relações com a
-- antiga tabela `establishments`, que deixou de ser usada pelo catálogo.
-- Remova-as quando existirem para permitir os IDs do schema atual.
SET @drop_legacy_favorites_fk = (
    SELECT IF(COUNT(*) > 0,
        'ALTER TABLE favorites DROP FOREIGN KEY fk_favorites_establishment',
        'SELECT 1')
    FROM information_schema.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND TABLE_NAME = 'favorites'
      AND CONSTRAINT_NAME = 'fk_favorites_establishment'
);
PREPARE drop_legacy_favorites_fk FROM @drop_legacy_favorites_fk;
EXECUTE drop_legacy_favorites_fk;
DEALLOCATE PREPARE drop_legacy_favorites_fk;

SET @drop_legacy_appointments_fk = (
    SELECT IF(COUNT(*) > 0,
        'ALTER TABLE appointments DROP FOREIGN KEY fk_appointments_establishment',
        'SELECT 1')
    FROM information_schema.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND TABLE_NAME = 'appointments'
      AND CONSTRAINT_NAME = 'fk_appointments_establishment'
);
PREPARE drop_legacy_appointments_fk FROM @drop_legacy_appointments_fk;
EXECUTE drop_legacy_appointments_fk;
DEALLOCATE PREPARE drop_legacy_appointments_fk;
