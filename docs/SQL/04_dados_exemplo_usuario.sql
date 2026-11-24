SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- EASY HEALTH
-- 40 USUÁRIOS DE DEMONSTRAÇÃO
-- MySQL 8+
--
-- 10 pacientes
-- 10 médicos
-- 10 funcionários
-- 10 donos
--
-- Senha de todas as contas: senha123
--
-- Não modifica registros existentes.


START TRANSACTION;


-- PACIENTES (10)


INSERT IGNORE INTO users (
    id, nome, email, senha_hash, telefone,
    data_nascimento, tipo_sanguineo, alergias,
    medicamentos_em_uso, plano_de_saude,
    email_verificado, cargo
)
VALUES
(
    'demo-paciente-01', 'Maria Silva',
    'maria.silva@email.com',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(11) 99999-9999', '1990-05-12', 'O+',
    'Nenhuma', NULL, 'Plano Horizonte', TRUE, 'paciente'
),
(
    'demo-paciente-02', 'Pedro Santos',
    'pedro.santos@example.org',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(19) 98888-4444', '1998-11-19', 'AB+',
    'Pólen', 'Antialérgico conforme prescrição',
    'Plano Bem Estar', TRUE, 'paciente'
),
(
    'demo-paciente-03', 'Camila Oliveira',
    'camila.oliveira@example.org',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(21) 98888-5555', '2001-07-08', 'O-',
    'Amoxicilina', NULL, 'Plano Horizonte', TRUE, 'paciente'
),
(
    'demo-paciente-04', 'Julia Ferreira',
    'julia.ferreira@example.org',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(82) 98888-1001', '1995-03-15', 'A+',
    'Lactose', NULL, 'Plano Horizonte', TRUE, 'paciente'
),
(
    'demo-paciente-05', 'Lucas Ribeiro',
    'lucas.ribeiro@example.org',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(82) 98888-1002', '2003-06-22', 'O+',
    NULL, NULL, 'Plano Vida Total', TRUE, 'paciente'
),
(
    'demo-paciente-06', 'Mariana Souza',
    'mariana.souza@example.org',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(82) 98888-1003', '1989-12-10', 'B-',
    'Dipirona', NULL, 'Plano Bem Estar', TRUE, 'paciente'
),
(
    'demo-paciente-07', 'Gabriel Lima',
    'gabriel.lima@example.org',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(82) 98888-1004', '1997-08-04', 'AB+',
    NULL, 'Vitamina D', NULL, TRUE, 'paciente'
),
(
    'demo-paciente-08', 'Beatriz Martins',
    'beatriz.martins@example.org',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(82) 98888-1005', '2000-01-19', 'O-',
    'Amendoim', NULL, 'Plano Horizonte', TRUE, 'paciente'
),
(
    'demo-paciente-09', 'Ricardo Nunes',
    'ricardo.nunes@example.org',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(82) 98888-1006', '1993-04-25', 'A-',
    NULL, NULL, 'Plano Saúde Mais', TRUE, 'paciente'
),
(
    'demo-paciente-10', 'Isabela Rocha',
    'isabela.rocha@example.org',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(82) 98888-1007', '2002-09-14', 'B+',
    'Frutos do mar', NULL, 'Plano Horizonte', TRUE, 'paciente'
);

-- MÉDICOS (10)

INSERT IGNORE INTO users (
    id, nome, email, senha_hash, telefone, email_verificado, cargo
)
VALUES
('demo-medico', 'Dra. Ana Médica', 'ana.medica@email.com',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0002', TRUE, 'medico'),
('demo-medico-02', 'Bruno Costa', 'bruno.costa@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0004', TRUE, 'medico'),
('demo-medico-03', 'Carolina Mendes', 'carolina.mendes@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0005', TRUE, 'medico'),
('demo-medico-04', 'Daniel Almeida', 'daniel.almeida@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0006', TRUE, 'medico'),
('demo-medico-05', 'Eduarda Lima', 'eduarda.lima@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0007', TRUE, 'medico'),
('demo-medico-06', 'Felipe Rocha', 'felipe.rocha@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0008', TRUE, 'medico'),
('demo-medico-07', 'Gabriela Alves', 'gabriela.alves@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0009', TRUE, 'medico'),
('demo-medico-08', 'Henrique Souza', 'henrique.souza@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0010', TRUE, 'medico'),
('demo-medico-09', 'Isabela Martins', 'isabela.martins@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0011', TRUE, 'medico'),
('demo-medico-10', 'João Ferreira', 'joao.ferreira@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0012', TRUE, 'medico');


-- FUNCIONÁRIOS (10)

INSERT IGNORE INTO users (
    id, nome, email, senha_hash, telefone, email_verificado, cargo
)
VALUES
('demo-funcionario', 'Carlos Funcionário', 'carlos.funcionario@email.com',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0001', TRUE, 'funcionario'),
('demo-funcionario-02', 'Laura Pereira', 'laura.pereira@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0013', TRUE, 'funcionario'),
('demo-funcionario-03', 'Marcos Oliveira', 'marcos.oliveira@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0014', TRUE, 'funcionario'),
('demo-funcionario-04', 'Natalia Santos', 'natalia.santos@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0015', TRUE, 'funcionario'),
('demo-funcionario-05', 'Otávio Ribeiro', 'otavio.ribeiro@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0016', TRUE, 'funcionario'),
('demo-funcionario-06', 'Paula Mendes', 'paula.mendes@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0017', TRUE, 'funcionario'),
('demo-funcionario-07', 'Rafael Lima', 'rafael.lima@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0018', TRUE, 'funcionario'),
('demo-funcionario-08', 'Sofia Costa', 'sofia.costa@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0019', TRUE, 'funcionario'),
('demo-funcionario-09', 'Thiago Alves', 'thiago.alves@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0020', TRUE, 'funcionario'),
('demo-funcionario-10', 'Vanessa Rocha', 'vanessa.rocha@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0021', TRUE, 'funcionario');


-- DONOS (10)

INSERT IGNORE INTO users (
    id, nome, email, senha_hash, telefone, email_verificado, cargo
)
VALUES
('demo-dono', 'Roberto Dono', 'roberto.dono@email.com',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0003', TRUE, 'dono'),
('demo-dono-02', 'Alice Fernandes', 'alice.fernandes@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0022', TRUE, 'dono'),
('demo-dono-03', 'Bernardo Castro', 'bernardo.castro@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0023', TRUE, 'dono'),
('demo-dono-04', 'Clara Nunes', 'clara.nunes@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0024', TRUE, 'dono'),
('demo-dono-05', 'Diego Martins', 'diego.martins@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0025', TRUE, 'dono'),
('demo-dono-06', 'Elisa Ferreira', 'elisa.ferreira@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0026', TRUE, 'dono'),
('demo-dono-07', 'Fabio Santos', 'fabio.santos@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0027', TRUE, 'dono'),
('demo-dono-08', 'Giovana Ribeiro', 'giovana.ribeiro@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0028', TRUE, 'dono'),
('demo-dono-09', 'Heitor Almeida', 'heitor.almeida@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0029', TRUE, 'dono'),
('demo-dono-10', 'Ingrid Souza', 'ingrid.souza@example.org',
 '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby', '(11) 98888-0030', TRUE, 'dono');

INSERT IGNORE INTO establishment_staff (user_id, establishment_id, cargo)
VALUES
('demo-medico', 'parceiro-hospital-exemplo', 'medico'),
('demo-funcionario', 'parceiro-hospital-exemplo', 'funcionario'),
('demo-dono', 'parceiro-hospital-exemplo', 'dono');

COMMIT;
