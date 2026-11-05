-- ============================================================
-- EASY HEALTH - ESQUEMA DO CATÁLOGO DE INSTITUIÇÕES
-- ============================================================
-- Este banco separado fornece o catálogo de exemplo consumido pela API do app.
-- Os registros fictícios ficam em 03_dados_exemplo_instituicoes.sql; não há
-- integração ativa com CNES, Google Places ou serviços externos.
-- Este arquivo cria somente o banco, as tabelas e os índices. Os dados de
-- demonstração ficam separados em 03_dados_exemplo_instituicoes.sql.
-- ============================================================

SET @easyhealth_app_database = DATABASE();

CREATE DATABASE IF NOT EXISTS easyhealth_institutions
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;
USE easyhealth_institutions;

CREATE TABLE IF NOT EXISTS instituicoes_saude (
    id VARCHAR(191) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo ENUM(
        'hospital',
        'upa',
        'ubs',
        'clinica',
        'centro_saude',
        'laboratorio',
        'consultorio',
        'farmacia',
        'outros'
    ) NOT NULL,
    rede_atendimento ENUM('publico', 'privado', 'filantropica', 'misto') NOT NULL DEFAULT 'publico',
    razao_social VARCHAR(255),
    cnpj VARCHAR(18) UNIQUE,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(20),
    bairro VARCHAR(120) NOT NULL,
    cidade VARCHAR(120) NOT NULL,
    uf CHAR(2) NOT NULL,
    cep CHAR(9),
    endereco_completo VARCHAR(500) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    telefone VARCHAR(32),
    whatsapp VARCHAR(32),
    email VARCHAR(255),
    site_url VARCHAR(255),
    status ENUM('aberto', 'fechado', 'emergencia', 'indisponivel') NOT NULL DEFAULT 'aberto',
    status_label VARCHAR(100),
    horario_padrao VARCHAR(100) NOT NULL DEFAULT '24h',
    avaliacao DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    avaliacoes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_instituicoes_tipo (tipo),
    INDEX idx_instituicoes_cidade_uf (cidade, uf),
    INDEX idx_instituicoes_status (status),
    INDEX idx_instituicoes_lat_lon (latitude, longitude),
    INDEX idx_instituicoes_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS especialidades (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(180) NOT NULL UNIQUE,
    categoria VARCHAR(120),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS instituicao_especialidades (
    instituicao_id VARCHAR(191) NOT NULL,
    especialidade_id BIGINT NOT NULL,
    PRIMARY KEY (instituicao_id, especialidade_id),
    CONSTRAINT fk_ie_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes_saude(id) ON DELETE CASCADE,
    CONSTRAINT fk_ie_especialidade FOREIGN KEY (especialidade_id) REFERENCES especialidades(id) ON DELETE CASCADE,
    INDEX idx_ie_especialidade (especialidade_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS convenios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(180) NOT NULL UNIQUE,
    tipo ENUM('saude', 'odontologia', 'plano', 'outros') NOT NULL DEFAULT 'saude',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS instituicao_convenios (
    instituicao_id VARCHAR(191) NOT NULL,
    convenio_id BIGINT NOT NULL,
    PRIMARY KEY (instituicao_id, convenio_id),
    CONSTRAINT fk_ic_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes_saude(id) ON DELETE CASCADE,
    CONSTRAINT fk_ic_convenio FOREIGN KEY (convenio_id) REFERENCES convenios(id) ON DELETE CASCADE,
    INDEX idx_ic_convenio (convenio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS agendas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    instituicao_id VARCHAR(191) NOT NULL,
    dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
    horario_abertura TIME NOT NULL,
    horario_fechamento TIME NOT NULL,
    tipo ENUM('consultorio', 'atendimento_geral', 'emergencia', 'exames', 'vacina') NOT NULL DEFAULT 'consultorio',
    status ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
    CONSTRAINT fk_agendas_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes_saude(id) ON DELETE CASCADE,
    INDEX idx_agendas_instituicao_dia (instituicao_id, dia_semana)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SELECT User
INTO @easyhealth_app_user
FROM mysql.db
WHERE Db = @easyhealth_app_database
  AND User <> ''
ORDER BY User
LIMIT 1;

SET @institutions_access_grant = CONCAT(
    'GRANT SELECT ON `easyhealth_institutions`.* TO ',
    QUOTE(@easyhealth_app_user),
    '@''%'''
);
PREPARE grant_institutions_access FROM @institutions_access_grant;
EXECUTE grant_institutions_access;
DEALLOCATE PREPARE grant_institutions_access;
