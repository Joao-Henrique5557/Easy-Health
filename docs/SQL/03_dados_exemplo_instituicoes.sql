-- ============================================================
-- EASY HEALTH - DADOS FICTÍCIOS PARA DEMONSTRAÇÃO
-- ============================================================
-- Execute depois de 02_instituicoes_medicas.sql.
-- Nomes, endereços, contatos, avaliações e coordenadas são exemplos;
-- não representam estabelecimentos reais nem disponibilidade de atendimento.
-- O script pode ser executado novamente sem duplicar os relacionamentos.
-- ============================================================

USE easyhealth_institutions;

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
        'aberto', 'Demonstração', 'Segunda a sexta, 08h às 20h', 4.30, 64),
    ('parceiro-upa-centro-sp', 'UPA Centro Norte (simulação)', 'upa', 'publico',
        'Avenida da Urgência', '610', 'Santana', 'São Paulo', 'SP', '02010-000',
        'Avenida da Urgência, 610 - Santana, São Paulo - SP', -23.502100, -46.625900,
        '+55 11 0000-0610', 'upa.santana@example.org', NULL,
        'aberto', 'Atendimento de urgência', '24h', 0.00, 0),
    ('parceiro-ubs-vila-mariana', 'UBS Vila das Flores (simulação)', 'ubs', 'publico',
        'Rua das Acácias', '720', 'Vila Mariana', 'São Paulo', 'SP', '04110-000',
        'Rua das Acácias, 720 - Vila Mariana, São Paulo - SP', -23.590200, -46.637800,
        '+55 11 0000-0720', 'ubs.viladasflores@example.org', NULL,
        'aberto', 'Demonstração', 'Segunda a sexta, 07h às 17h', 0.00, 0),
    ('parceiro-hospital-campinas', 'Hospital das Palmeiras (simulação)', 'hospital', 'filantropica',
        'Avenida das Palmeiras', '830', 'Cambuí', 'Campinas', 'SP', '13025-000',
        'Avenida das Palmeiras, 830 - Cambuí, Campinas - SP', -22.897800, -47.052300,
        '+55 19 0000-0830', 'contato@palmeiras.example.org', 'https://palmeiras.example.org',
        'aberto', 'Demonstração', '24h', 4.50, 176),
    ('parceiro-clinica-campinas', 'Clínica Estação Saúde (simulação)', 'clinica', 'privado',
        'Rua dos Trilhos', '940', 'Botafogo', 'Campinas', 'SP', '13020-000',
        'Rua dos Trilhos, 940 - Botafogo, Campinas - SP', -22.899400, -47.068100,
        '+55 19 0000-0940', 'agenda@estacao.example.org', 'https://estacao.example.org',
        'aberto', 'Demonstração', 'Segunda a sábado, 08h às 19h', 4.20, 91),
    ('parceiro-upa-campinas', 'UPA Campo Verde (simulação)', 'upa', 'publico',
        'Rua Campo Verde', '1050', 'Ouro Verde', 'Campinas', 'SP', '13054-000',
        'Rua Campo Verde, 1050 - Ouro Verde, Campinas - SP', -22.950100, -47.118700,
        '+55 19 0000-1050', 'upa.ouroverde@example.org', NULL,
        'aberto', 'Atendimento de urgência', '24h', 0.00, 0),
    ('parceiro-lab-campinas', 'Laboratório Horizonte Sul (simulação)', 'laboratorio', 'privado',
        'Avenida dos Ipês', '1160', 'Taquaral', 'Campinas', 'SP', '13076-000',
        'Avenida dos Ipês, 1160 - Taquaral, Campinas - SP', -22.875600, -47.048200,
        '+55 19 0000-1160', 'coleta@horizontesul.example.org', 'https://horizontesul.example.org',
        'aberto', 'Demonstração', 'Segunda a sábado, 06h às 15h', 4.60, 138),
    ('parceiro-hospital-rio', 'Hospital Costa Azul (simulação)', 'hospital', 'privado',
        'Avenida Atlântica Modelo', '1270', 'Copacabana', 'Rio de Janeiro', 'RJ', '22010-000',
        'Avenida Atlântica Modelo, 1270 - Copacabana, Rio de Janeiro - RJ', -22.971100, -43.186800,
        '+55 21 0000-1270', 'contato@costaazul.example.org', 'https://costaazul.example.org',
        'aberto', 'Demonstração', '24h', 4.70, 245),
    ('parceiro-upa-rio', 'UPA Baía Clara (simulação)', 'upa', 'publico',
        'Rua da Baía', '1380', 'Tijuca', 'Rio de Janeiro', 'RJ', '20510-000',
        'Rua da Baía, 1380 - Tijuca, Rio de Janeiro - RJ', -22.925400, -43.235000,
        '+55 21 0000-1380', 'upa.tijuca@example.org', NULL,
        'aberto', 'Atendimento de urgência', '24h', 0.00, 0),
    ('parceiro-ubs-rio', 'UBS Morro do Sol (simulação)', 'ubs', 'publico',
        'Rua do Sol Nascente', '1490', 'Botafogo', 'Rio de Janeiro', 'RJ', '22250-000',
        'Rua do Sol Nascente, 1490 - Botafogo, Rio de Janeiro - RJ', -22.951000, -43.185500,
        '+55 21 0000-1490', 'ubs.morrodo.sol@example.org', NULL,
        'aberto', 'Demonstração', 'Segunda a sexta, 07h às 17h', 0.00, 0),
    ('parceiro-clinica-rio', 'Clínica Jardim Atlântico (simulação)', 'clinica', 'privado',
        'Rua das Conchas', '1510', 'Ipanema', 'Rio de Janeiro', 'RJ', '22420-000',
        'Rua das Conchas, 1510 - Ipanema, Rio de Janeiro - RJ', -22.984500, -43.201200,
        '+55 21 0000-1510', 'agenda@jardimatlantico.example.org', 'https://jardimatlantico.example.org',
        'aberto', 'Demonstração', 'Segunda a sexta, 08h às 18h', 4.30, 102),
    ('parceiro-hospital-bh', 'Hospital Serra Clara (simulação)', 'hospital', 'filantropica',
        'Avenida das Montanhas', '1620', 'Funcionários', 'Belo Horizonte', 'MG', '30130-000',
        'Avenida das Montanhas, 1620 - Funcionários, Belo Horizonte - MG', -19.934100, -43.937800,
        '+55 31 0000-1620', 'contato@serraclara.example.org', 'https://serraclara.example.org',
        'aberto', 'Demonstração', '24h', 4.40, 154),
    ('parceiro-upa-bh', 'UPA Horizonte Oeste (simulação)', 'upa', 'publico',
        'Rua do Horizonte', '1730', 'Barreiro', 'Belo Horizonte', 'MG', '30640-000',
        'Rua do Horizonte, 1730 - Barreiro, Belo Horizonte - MG', -19.976400, -44.023100,
        '+55 31 0000-1730', 'upa.barreiro@example.org', NULL,
        'aberto', 'Atendimento de urgência', '24h', 0.00, 0),
    ('parceiro-ubs-bh', 'UBS Jardim das Pedras (simulação)', 'ubs', 'publico',
        'Rua das Pedras', '1840', 'Pampulha', 'Belo Horizonte', 'MG', '31270-000',
        'Rua das Pedras, 1840 - Pampulha, Belo Horizonte - MG', -19.851500, -43.971000,
        '+55 31 0000-1840', 'ubs.pedras@example.org', NULL,
        'aberto', 'Demonstração', 'Segunda a sexta, 07h às 17h', 0.00, 0),
    ('parceiro-clinica-recife', 'Clínica Mar do Norte (simulação)', 'clinica', 'privado',
        'Avenida Boa Viagem Modelo', '1950', 'Boa Viagem', 'Recife', 'PE', '51020-000',
        'Avenida Boa Viagem Modelo, 1950 - Boa Viagem, Recife - PE', -8.119200, -34.897100,
        '+55 81 0000-1950', 'agenda@mardonorte.example.org', 'https://mardonorte.example.org',
        'aberto', 'Demonstração', 'Segunda a sábado, 08h às 19h', 4.50, 119),
    ('parceiro-hospital-recife', 'Hospital Ilha Serena (simulação)', 'hospital', 'privado',
        'Rua das Pontes', '2060', 'Ilha do Leite', 'Recife', 'PE', '50070-000',
        'Rua das Pontes, 2060 - Ilha do Leite, Recife - PE', -8.063100, -34.897600,
        '+55 81 0000-2060', 'contato@ilhaserena.example.org', 'https://ilhaserena.example.org',
        'aberto', 'Demonstração', '24h', 4.60, 203),
    ('parceiro-ubs-recife', 'UBS Jardim do Capibaribe (simulação)', 'ubs', 'publico',
        'Rua Capibaribe Modelo', '2170', 'Casa Amarela', 'Recife', 'PE', '52070-000',
        'Rua Capibaribe Modelo, 2170 - Casa Amarela, Recife - PE', -8.025500, -34.916400,
        '+55 81 0000-2170', 'ubs.capibaribe@example.org', NULL,
        'aberto', 'Demonstração', 'Segunda a sexta, 07h às 17h', 0.00, 0),
    ('parceiro-hospital-brasilia', 'Hospital Planalto Verde (simulação)', 'hospital', 'filantropica',
        'Eixo Central Modelo', '2280', 'Asa Sul', 'Brasília', 'DF', '70390-000',
        'Eixo Central Modelo, 2280 - Asa Sul, Brasília - DF', -15.802700, -47.887200,
        '+55 61 0000-2280', 'contato@planaltoverde.example.org', 'https://planaltoverde.example.org',
        'aberto', 'Demonstração', '24h', 4.30, 132),
    ('parceiro-upa-brasilia', 'UPA Cerrado Azul (simulação)', 'upa', 'publico',
        'Avenida do Cerrado', '2390', 'Ceilândia', 'Brasília', 'DF', '72220-000',
        'Avenida do Cerrado, 2390 - Ceilândia, Brasília - DF', -15.819700, -48.108100,
        '+55 61 0000-2390', 'upa.ceilandia@example.org', NULL,
        'aberto', 'Atendimento de urgência', '24h', 0.00, 0),
    ('parceiro-lab-brasilia', 'Laboratório Planalto (simulação)', 'laboratorio', 'privado',
        'Rua das Veredas', '2400', 'Asa Norte', 'Brasília', 'DF', '70710-000',
        'Rua das Veredas, 2400 - Asa Norte, Brasília - DF', -15.760100, -47.882600,
        '+55 61 0000-2400', 'coleta@labplanalto.example.org', 'https://labplanalto.example.org',
        'aberto', 'Demonstração', 'Segunda a sábado, 06h às 16h', 4.40, 97),
    ('parceiro-centro-poa', 'Centro Integrado Lago das Águas (simulação)', 'centro_saude', 'filantropica',
        'Avenida das Araucárias', '2510', 'Moinhos de Vento', 'Porto Alegre', 'RS', '90570-000',
        'Avenida das Araucárias, 2510 - Moinhos de Vento, Porto Alegre - RS', -30.023400, -51.201700,
        '+55 51 0000-2510', 'contato@lagodasaguas.example.org', 'https://lagodasaguas.example.org',
        'aberto', 'Demonstração', 'Segunda a sexta, 08h às 20h', 4.20, 78),
    ('parceiro-hospital-poa', 'Hospital Campo dos Ventos (simulação)', 'hospital', 'privado',
        'Rua dos Pampas', '2620', 'Partenon', 'Porto Alegre', 'RS', '90620-000',
        'Rua dos Pampas, 2620 - Partenon, Porto Alegre - RS', -30.061100, -51.175000,
        '+55 51 0000-2620', 'contato@campodosventos.example.org', 'https://campodosventos.example.org',
        'aberto', 'Demonstração', '24h', 4.50, 167)
AS incoming
ON DUPLICATE KEY UPDATE nome = incoming.nome;

INSERT INTO especialidades (nome, categoria)
VALUES
    ('Cardiologia', 'Clínica médica'),
    ('Clínica médica', 'Clínica médica'),
    ('Pediatria', 'Clínica médica'),
    ('Dermatologia', 'Clínica médica'),
    ('Ortopedia', 'Clínica médica'),
    ('Ginecologia', 'Clínica médica'),
    ('Oftalmologia', 'Clínica médica'),
    ('Neurologia', 'Clínica médica'),
    ('Psiquiatria', 'Saúde mental'),
    ('Psicologia', 'Saúde mental'),
    ('Nutrição', 'Atenção especializada'),
    ('Fisioterapia', 'Reabilitação'),
    ('Odontologia', 'Saúde bucal'),
    ('Urologia', 'Clínica médica'),
    ('Endocrinologia', 'Clínica médica'),
    ('Otorrinolaringologia', 'Clínica médica'),
    ('Exames laboratoriais', 'Diagnóstico'),
    ('Diagnóstico por imagem', 'Diagnóstico'),
    ('Vacinação', 'Prevenção'),
    ('Atendimento de urgência', 'Urgência e emergência')
AS incoming
ON DUPLICATE KEY UPDATE categoria = incoming.categoria;

INSERT INTO instituicao_especialidades (instituicao_id, especialidade_id)
SELECT relacionamentos.instituicao_id, especialidades.id
FROM (
    SELECT 'parceiro-hospital-exemplo' AS instituicao_id, 'Cardiologia' AS especialidade
    UNION ALL SELECT 'parceiro-hospital-exemplo', 'Clínica médica'
    UNION ALL SELECT 'parceiro-hospital-exemplo', 'Pediatria'
    UNION ALL SELECT 'parceiro-hospital-exemplo', 'Ortopedia'
    UNION ALL SELECT 'parceiro-hospital-exemplo', 'Atendimento de urgência'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 'Dermatologia'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 'Ortopedia'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 'Ginecologia'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 'Psicologia'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 'Clínica médica'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 'Pediatria'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 'Vacinação'
    UNION ALL SELECT 'parceiro-laboratorio-exemplo', 'Exames laboratoriais'
    UNION ALL SELECT 'parceiro-laboratorio-exemplo', 'Diagnóstico por imagem'
    UNION ALL SELECT 'parceiro-centro-exemplo', 'Cardiologia'
    UNION ALL SELECT 'parceiro-centro-exemplo', 'Clínica médica'
    UNION ALL SELECT 'parceiro-centro-exemplo', 'Nutrição'
    UNION ALL SELECT 'parceiro-upa-centro-sp', 'Atendimento de urgência'
    UNION ALL SELECT 'parceiro-ubs-vila-mariana', 'Clínica médica'
    UNION ALL SELECT 'parceiro-ubs-vila-mariana', 'Pediatria'
    UNION ALL SELECT 'parceiro-ubs-vila-mariana', 'Vacinação'
    UNION ALL SELECT 'parceiro-hospital-campinas', 'Cardiologia'
    UNION ALL SELECT 'parceiro-hospital-campinas', 'Neurologia'
    UNION ALL SELECT 'parceiro-hospital-campinas', 'Atendimento de urgência'
    UNION ALL SELECT 'parceiro-clinica-campinas', 'Oftalmologia'
    UNION ALL SELECT 'parceiro-clinica-campinas', 'Endocrinologia'
    UNION ALL SELECT 'parceiro-clinica-campinas', 'Psicologia'
    UNION ALL SELECT 'parceiro-upa-campinas', 'Atendimento de urgência'
    UNION ALL SELECT 'parceiro-lab-campinas', 'Exames laboratoriais'
    UNION ALL SELECT 'parceiro-lab-campinas', 'Diagnóstico por imagem'
    UNION ALL SELECT 'parceiro-hospital-rio', 'Cardiologia'
    UNION ALL SELECT 'parceiro-hospital-rio', 'Pediatria'
    UNION ALL SELECT 'parceiro-hospital-rio', 'Atendimento de urgência'
    UNION ALL SELECT 'parceiro-upa-rio', 'Atendimento de urgência'
    UNION ALL SELECT 'parceiro-ubs-rio', 'Clínica médica'
    UNION ALL SELECT 'parceiro-ubs-rio', 'Vacinação'
    UNION ALL SELECT 'parceiro-clinica-rio', 'Dermatologia'
    UNION ALL SELECT 'parceiro-clinica-rio', 'Ginecologia'
    UNION ALL SELECT 'parceiro-hospital-bh', 'Cardiologia'
    UNION ALL SELECT 'parceiro-hospital-bh', 'Ortopedia'
    UNION ALL SELECT 'parceiro-hospital-bh', 'Atendimento de urgência'
    UNION ALL SELECT 'parceiro-upa-bh', 'Atendimento de urgência'
    UNION ALL SELECT 'parceiro-ubs-bh', 'Clínica médica'
    UNION ALL SELECT 'parceiro-ubs-bh', 'Pediatria'
    UNION ALL SELECT 'parceiro-clinica-recife', 'Dermatologia'
    UNION ALL SELECT 'parceiro-clinica-recife', 'Nutrição'
    UNION ALL SELECT 'parceiro-hospital-recife', 'Cardiologia'
    UNION ALL SELECT 'parceiro-hospital-recife', 'Neurologia'
    UNION ALL SELECT 'parceiro-hospital-recife', 'Atendimento de urgência'
    UNION ALL SELECT 'parceiro-ubs-recife', 'Clínica médica'
    UNION ALL SELECT 'parceiro-ubs-recife', 'Vacinação'
    UNION ALL SELECT 'parceiro-hospital-brasilia', 'Cardiologia'
    UNION ALL SELECT 'parceiro-hospital-brasilia', 'Ortopedia'
    UNION ALL SELECT 'parceiro-hospital-brasilia', 'Atendimento de urgência'
    UNION ALL SELECT 'parceiro-upa-brasilia', 'Atendimento de urgência'
    UNION ALL SELECT 'parceiro-lab-brasilia', 'Exames laboratoriais'
    UNION ALL SELECT 'parceiro-lab-brasilia', 'Diagnóstico por imagem'
    UNION ALL SELECT 'parceiro-centro-poa', 'Fisioterapia'
    UNION ALL SELECT 'parceiro-centro-poa', 'Psicologia'
    UNION ALL SELECT 'parceiro-hospital-poa', 'Cardiologia'
    UNION ALL SELECT 'parceiro-hospital-poa', 'Urologia'
    UNION ALL SELECT 'parceiro-hospital-poa', 'Atendimento de urgência'
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
    ('Plano Vida Exemplo', 'saude'),
    ('Plano Bem-Estar Exemplo', 'saude'),
    ('Plano Odonto Exemplo', 'odontologia'),
    ('Plano Regional Modelo', 'plano'),
    ('Atendimento SUS', 'outros'),
    ('Atendimento Social Simulado', 'outros')
AS incoming
ON DUPLICATE KEY UPDATE tipo = incoming.tipo;

INSERT INTO instituicao_convenios (instituicao_id, convenio_id)
SELECT relacionamentos.instituicao_id, convenios.id
FROM (
    SELECT 'parceiro-hospital-exemplo' AS instituicao_id, 'Plano Demonstração A' AS convenio
    UNION ALL SELECT 'parceiro-hospital-exemplo', 'Plano Demonstração B'
    UNION ALL SELECT 'parceiro-hospital-exemplo', 'Plano Vida Exemplo'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 'Plano Demonstração A'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 'Plano Odonto Exemplo'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 'Atendimento SUS'
    UNION ALL SELECT 'parceiro-laboratorio-exemplo', 'Plano Bem-Estar Exemplo'
    UNION ALL SELECT 'parceiro-centro-exemplo', 'Atendimento Social Simulado'
    UNION ALL SELECT 'parceiro-upa-centro-sp', 'Atendimento SUS'
    UNION ALL SELECT 'parceiro-ubs-vila-mariana', 'Atendimento SUS'
    UNION ALL SELECT 'parceiro-hospital-campinas', 'Plano Vida Exemplo'
    UNION ALL SELECT 'parceiro-hospital-campinas', 'Plano Regional Modelo'
    UNION ALL SELECT 'parceiro-clinica-campinas', 'Plano Demonstração B'
    UNION ALL SELECT 'parceiro-upa-campinas', 'Atendimento SUS'
    UNION ALL SELECT 'parceiro-lab-campinas', 'Plano Bem-Estar Exemplo'
    UNION ALL SELECT 'parceiro-hospital-rio', 'Plano Demonstração A'
    UNION ALL SELECT 'parceiro-hospital-rio', 'Plano Regional Modelo'
    UNION ALL SELECT 'parceiro-upa-rio', 'Atendimento SUS'
    UNION ALL SELECT 'parceiro-ubs-rio', 'Atendimento SUS'
    UNION ALL SELECT 'parceiro-clinica-rio', 'Plano Vida Exemplo'
    UNION ALL SELECT 'parceiro-hospital-bh', 'Plano Demonstração B'
    UNION ALL SELECT 'parceiro-upa-bh', 'Atendimento SUS'
    UNION ALL SELECT 'parceiro-ubs-bh', 'Atendimento SUS'
    UNION ALL SELECT 'parceiro-clinica-recife', 'Plano Regional Modelo'
    UNION ALL SELECT 'parceiro-hospital-recife', 'Plano Vida Exemplo'
    UNION ALL SELECT 'parceiro-ubs-recife', 'Atendimento SUS'
    UNION ALL SELECT 'parceiro-hospital-brasilia', 'Plano Demonstração A'
    UNION ALL SELECT 'parceiro-upa-brasilia', 'Atendimento SUS'
    UNION ALL SELECT 'parceiro-lab-brasilia', 'Plano Bem-Estar Exemplo'
    UNION ALL SELECT 'parceiro-centro-poa', 'Atendimento Social Simulado'
    UNION ALL SELECT 'parceiro-hospital-poa', 'Plano Regional Modelo'
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
    UNION ALL SELECT 'parceiro-hospital-exemplo', 3, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-hospital-exemplo', 4, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-hospital-exemplo', 5, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-hospital-exemplo', 6, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-hospital-exemplo', 7, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 1, '08:00:00', '18:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 2, '08:00:00', '18:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 3, '08:00:00', '18:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 4, '08:00:00', '18:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-clinica-exemplo', 5, '08:00:00', '18:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 1, '07:00:00', '17:00:00', 'atendimento_geral'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 2, '07:00:00', '17:00:00', 'atendimento_geral'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 3, '07:00:00', '17:00:00', 'atendimento_geral'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 4, '07:00:00', '17:00:00', 'atendimento_geral'
    UNION ALL SELECT 'parceiro-ubs-exemplo', 5, '07:00:00', '17:00:00', 'atendimento_geral'
    UNION ALL SELECT 'parceiro-laboratorio-exemplo', 1, '06:00:00', '16:00:00', 'exames'
    UNION ALL SELECT 'parceiro-laboratorio-exemplo', 2, '06:00:00', '16:00:00', 'exames'
    UNION ALL SELECT 'parceiro-laboratorio-exemplo', 3, '06:00:00', '16:00:00', 'exames'
    UNION ALL SELECT 'parceiro-laboratorio-exemplo', 4, '06:00:00', '16:00:00', 'exames'
    UNION ALL SELECT 'parceiro-laboratorio-exemplo', 5, '06:00:00', '16:00:00', 'exames'
    UNION ALL SELECT 'parceiro-laboratorio-exemplo', 6, '06:00:00', '12:00:00', 'exames'
    UNION ALL SELECT 'parceiro-centro-exemplo', 1, '08:00:00', '20:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-centro-exemplo', 2, '08:00:00', '20:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-centro-exemplo', 3, '08:00:00', '20:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-centro-exemplo', 4, '08:00:00', '20:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-centro-exemplo', 5, '08:00:00', '20:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-upa-centro-sp', 1, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-upa-centro-sp', 7, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-hospital-campinas', 1, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-clinica-campinas', 2, '08:00:00', '19:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-clinica-campinas', 4, '08:00:00', '19:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-upa-campinas', 1, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-lab-campinas', 6, '06:00:00', '15:00:00', 'exames'
    UNION ALL SELECT 'parceiro-hospital-rio', 1, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-upa-rio', 1, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-ubs-rio', 1, '07:00:00', '17:00:00', 'atendimento_geral'
    UNION ALL SELECT 'parceiro-clinica-rio', 3, '08:00:00', '18:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-hospital-bh', 1, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-upa-bh', 1, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-ubs-bh', 2, '07:00:00', '17:00:00', 'atendimento_geral'
    UNION ALL SELECT 'parceiro-clinica-recife', 4, '08:00:00', '19:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-hospital-recife', 1, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-ubs-recife', 3, '07:00:00', '17:00:00', 'vacina'
    UNION ALL SELECT 'parceiro-hospital-brasilia', 1, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-upa-brasilia', 1, '00:00:00', '23:59:59', 'emergencia'
    UNION ALL SELECT 'parceiro-lab-brasilia', 6, '06:00:00', '16:00:00', 'exames'
    UNION ALL SELECT 'parceiro-centro-poa', 5, '08:00:00', '20:00:00', 'consultorio'
    UNION ALL SELECT 'parceiro-hospital-poa', 1, '00:00:00', '23:59:59', 'emergencia'
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
