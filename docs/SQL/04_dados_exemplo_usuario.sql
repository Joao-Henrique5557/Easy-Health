-- Conta de demonstração para desenvolvimento local.
-- Credenciais: maria.silva@email.com / senha123
-- Não substitui os dados de uma conta já existente.

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
ON DUPLICATE KEY UPDATE id = users.id;
