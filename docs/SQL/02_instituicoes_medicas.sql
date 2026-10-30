-- ============================================================
-- EASY HEALTH - CATÁLOGO DE INSTITUIÇÕES MÉDICAS DE DEMONSTRAÇÃO
-- ============================================================
-- Objetivo: representar hospitais, UPAs, UBSs, clínicas e centros de saúde
-- que poderiam integrar com o Easy Health. Todos os registros são fictícios;
-- este banco não representa uma integração ativa com APIs externas.
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

INSERT INTO instituicoes_saude (
    id, nome, tipo, rede_atendimento, logradouro, numero, bairro, cidade, uf, cep,
    endereco_completo, latitude, longitude, telefone, email, site_url, status,
    status_label, horario_padrao, avaliacao, avaliacoes_count
)
VALUES
    ('parceiro-hospital-exemplo', 'Hospital Horizonte (simulação)', 'hospital', 'privado',
        'Avenida Exemplo', '100', 'Centro', 'São Paulo', 'SP', '01000-000',
        'Avenida Exemplo, 100 - Centro, São Paulo - SP', -23.550520, -46.633308,
        '+55 11 0000-0100', 'contato@horizonte.example.org', 'https://horizonte.example.org',
        'aberto', 'Demonstração', '24h', 4.60, 120),
    ('parceiro-clinica-exemplo', 'Clínica Bem Viver (simulação)', 'clinica', 'privado',
        'Rua Modelo', '200', 'Jardins', 'São Paulo', 'SP', '01400-000',
        'Rua Modelo, 200 - Jardins, São Paulo - SP', -23.561414, -46.655881,
        '+55 11 0000-0200', 'agenda@bemviver.example.org', 'https://bemviver.example.org',
        'aberto', 'Demonstração', 'Segunda a sexta, 08h às 18h', 4.40, 85),
    ('parceiro-ubs-exemplo', 'UBS Parque Modelo (simulação)', 'ubs', 'publico',
        'Rua da Comunidade', '300', 'Parque Modelo', 'São Paulo', 'SP', '02000-000',
        'Rua da Comunidade, 300 - Parque Modelo, São Paulo - SP', -23.515000, -46.620000,
        '+55 11 0000-0300', 'ubs.modelo@example.org', NULL,
        'aberto', 'Demonstração', 'Segunda a sexta, 07h às 17h', 0.00, 0),
    ('parceiro-laboratorio-exemplo', 'Laboratório Amostra (simulação)', 'laboratorio', 'privado',
        'Alameda Teste', '400', 'Vila Nova', 'São Paulo', 'SP', '03000-000',
        'Alameda Teste, 400 - Vila Nova, São Paulo - SP', -23.535000, -46.610000,
        '+55 11 0000-0400', 'atendimento@amostra.example.org', 'https://amostra.example.org',
        'aberto', 'Demonstração', 'Segunda a sábado, 06h às 16h', 4.70, 210),
    ('parceiro-centro-exemplo', 'Centro Médico Conecta (simulação)', 'centro_saude', 'filantropica',
        'Praça da Saúde', '500', 'Centro', 'Campinas', 'SP', '13000-000',
        'Praça da Saúde, 500 - Centro, Campinas - SP', -22.905600, -47.060800,
        '+55 19 0000-0500', 'contato@conecta.example.org', 'https://conecta.example.org',
        'aberto', 'Demonstração', 'Segunda a sexta, 08h às 20h', 4.30, 64)
AS incoming
ON DUPLICATE KEY UPDATE nome = incoming.nome;

INSERT INTO especialidades (nome, categoria)
VALUES
    ('Cardiologia', 'Clínica médica'),
    ('Clínica médica', 'Clínica médica'),
    ('Pediatria', 'Clínica médica'),
    ('Dermatologia', 'Clínica médica'),
    ('Ortopedia', 'Clínica médica'),
    ('Exames laboratoriais', 'Diagnóstico')
AS incoming
ON DUPLICATE KEY UPDATE categoria = incoming.categoria;

INSERT INTO instituicao_especialidades (instituicao_id, especialidade_id)
SELECT relacionamentos.instituicao_id, especialidades.id
FROM (
    SELECT 'parceiro-hospital-exemplo' AS instituicao_id, 'Cardiologia' AS especialidade
    UNION ALL SELECT 'parceiro-hospital-exemplo', 'Clínica médica'
    UNION ALL SELECT 'parceiro-hospital-exemplo', 'Pediatria'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 'Dermatologia'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 'Ortopedia'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 'Clínica médica'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 'Pediatria'
    UNION ALL SELECT 'parceiro-laboratorio-exemplo', 'Exames laboratoriais'
    UNION ALL SELECT 'parceiro-centro-exemplo', 'Cardiologia'
    UNION ALL SELECT 'parceiro-centro-exemplo', 'Clínica médica'
) AS relacionamentos
JOIN especialidades ON especialidades.nome = relacionamentos.especialidade
WHERE NOT EXISTS (
    SELECT 1
    FROM instituicao_especialidades existentes
    WHERE existentes.instituicao_id = relacionamentos.instituicao_id
      AND existentes.especialidade_id = especialidades.id
);

INSERT INTO convenios (nome, tipo)
VALUES
    ('Plano Demonstração A', 'saude'),
    ('Plano Demonstração B', 'saude'),
    ('Atendimento SUS', 'outros')
AS incoming
ON DUPLICATE KEY UPDATE tipo = incoming.tipo;

INSERT INTO instituicao_convenios (instituicao_id, convenio_id)
SELECT relacionamentos.instituicao_id, convenios.id
FROM (
    SELECT 'parceiro-hospital-exemplo' AS instituicao_id, 'Plano Demonstração A' AS convenio
    UNION ALL SELECT 'parceiro-hospital-exemplo', 'Plano Demonstração B'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 'Plano Demonstração A'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 'Atendimento SUS'
    UNION ALL SELECT 'parceiro-centro-exemplo', 'Atendimento SUS'
) AS relacionamentos
JOIN convenios ON convenios.nome = relacionamentos.convenio
WHERE NOT EXISTS (
    SELECT 1
    FROM instituicao_convenios existentes
    WHERE existentes.instituicao_id = relacionamentos.instituicao_id
      AND existentes.convenio_id = convenios.id
);

INSERT INTO agendas (instituicao_id, dia_semana, horario_abertura, horario_fechamento, tipo)
SELECT agenda.instituicao_id, agenda.dia_semana, agenda.horario_abertura, agenda.horario_fechamento, agenda.tipo
FROM (
    SELECT 'parceiro-hospital-exemplo' AS instituicao_id, 1 AS dia_semana,
        '00:00:00' AS horario_abertura, '23:59:59' AS horario_fechamento, 'emergencia' AS tipo
    UNION ALL SELECT 'parceiro-hospital-exemplo', 2, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 1, '08:00:00', '18:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 3, '08:00:00', '18:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 1, '07:00:00', '17:00:00', 'atendimento_geral'
    UNION ALL SELECT 'parceiro-laboratorio-exemplo', 6, '06:00:00', '16:00:00', 'exames'
    UNION ALL SELECT 'parceiro-centro-exemplo', 5, '08:00:00', '20:00:00', 'consultorio'
) AS agenda
WHERE NOT EXISTS (
    SELECT 1
    FROM agendas existente
    WHERE existente.instituicao_id = agenda.instituicao_id
      AND existente.dia_semana = agenda.dia_semana
      AND existente.horario_abertura = agenda.horario_abertura
      AND existente.horario_fechamento = agenda.horario_fechamento
      AND existente.tipo = agenda.tipo
);

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
