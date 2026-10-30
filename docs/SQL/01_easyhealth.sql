-- Banco principal do Easy Health.
-- O backend também mantém estes scripts em src/main/resources para inicializar
-- instalações locais fora do Docker.

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

CREATE TABLE IF NOT EXISTS password_reset_codes (
    code_hash varchar(64) PRIMARY KEY,
    user_id varchar(36) NOT NULL,
    expires_at timestamp NOT NULL,
    used boolean NOT NULL DEFAULT false,
    CONSTRAINT fk_password_reset_codes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS establishments (
    id varchar(191) PRIMARY KEY,
    nome text NOT NULL,
    tipo varchar(64) NOT NULL,
    rede_atendimento varchar(32) NOT NULL DEFAULT 'publico',
    endereco text NOT NULL,
    avaliacao double NOT NULL DEFAULT 0,
    avaliacoes_count integer,
    status varchar(32) NOT NULL DEFAULT 'aberto',
    status_label varchar(100),
    horario varchar(100) NOT NULL DEFAULT '24h',
    telefone varchar(64),
    especialidades json NOT NULL,
    convenios json NOT NULL,
    latitude double NOT NULL,
    longitude double NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS first_aid_guides (
    id varchar(191) PRIMARY KEY,
    titulo varchar(255) NOT NULL,
    resumo text NOT NULL,
    icon varchar(64) NOT NULL,
    passos json NOT NULL,
    ordem integer NOT NULL DEFAULT 0
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
    CONSTRAINT fk_appointments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_establishment FOREIGN KEY (establishment_id) REFERENCES establishments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS favorites (
    user_id varchar(36) NOT NULL,
    establishment_id varchar(191) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, establishment_id),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_establishment FOREIGN KEY (establishment_id) REFERENCES establishments(id) ON DELETE CASCADE
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

INSERT INTO users (id, nome, email, senha_hash, telefone, email_verificado)
VALUES (
    'demo-user',
    'Maria Silva',
    'maria.silva@email.com',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(11) 99999-9999',
    true
)
AS incoming
ON DUPLICATE KEY UPDATE id = incoming.id;

INSERT INTO establishments (
    id, nome, tipo, rede_atendimento, endereco, avaliacao, avaliacoes_count, status,
    status_label, horario, telefone, especialidades, convenios, latitude, longitude
)
VALUES
    ('hosp-sao-lucas', 'Hospital São Lucas', 'hospital', 'privado', 'Av. Paulista, 1000 - São Paulo',
        4.8, 320, 'aberto', 'Aberto agora', '24h', NULL,
        JSON_ARRAY('Cardiologia', 'Clínica médica', 'Pediatria'), JSON_ARRAY(), -23.5505, -46.6333),
    ('upa-se', 'UPA Sé', 'upa', 'publico', 'Praça da Sé, 100 - São Paulo',
        4.8, 320, 'aberto', 'Aberto agora', '24h', NULL,
        JSON_ARRAY(), JSON_ARRAY(), -23.5503, -46.6339),
    ('ubs-republica', 'UBS República', 'ubs', 'publico', 'Rua do Arouche, 90 - São Paulo',
        4.8, 320, 'aberto', 'Aberto agora', 'Segunda a sexta', NULL,
        JSON_ARRAY(), JSON_ARRAY(), -23.5431, -46.6425)
AS incoming
ON DUPLICATE KEY UPDATE id = incoming.id;

INSERT INTO first_aid_guides (id, titulo, resumo, icon, passos, ordem)
VALUES
    ('engasgo', 'Engasgo', 'Orientações iniciais para uma situação de engasgo.', 'alert',
        JSON_ARRAY('Se a pessoa consegue tossir, incentive-a a continuar tossindo.', 'Se não consegue respirar ou falar, peça ajuda e ligue para o SAMU pelo 192.', 'Siga as orientações do atendente e procure atendimento de emergência.'), 1),
    ('queimadura', 'Queimaduras', 'Cuidados iniciais para queimaduras leves.', 'fire',
        JSON_ARRAY('Afaste a pessoa da fonte de calor com segurança.', 'Resfrie a área com água corrente fresca por 20 minutos.', 'Não use gelo, pasta de dente ou receitas caseiras.', 'Procure atendimento; ligue para o 192 em caso grave.'), 2),
    ('desmaio', 'Desmaio', 'Como agir quando alguém perde a consciência.', 'heart',
        JSON_ARRAY('Verifique se o local é seguro e chame a pessoa.', 'Se não acordar rapidamente, ligue para o SAMU pelo 192.', 'Verifique a respiração e siga as instruções do atendente.', 'Não ofereça alimentos ou líquidos enquanto a pessoa estiver inconsciente.'), 3),
    ('hemorragia', 'Sangramento intenso', 'Cuidados imediatos enquanto o socorro chega.', 'alert',
        JSON_ARRAY('Ligue para o SAMU pelo 192.', 'Com uma barreira de proteção, pressione o ferimento com pano limpo.', 'Mantenha a pressão e siga as orientações do atendente.'), 4)
AS incoming
ON DUPLICATE KEY UPDATE id = incoming.id;
