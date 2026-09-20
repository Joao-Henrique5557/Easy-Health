INSERT INTO users(id,nome,email,senha_hash,telefone,email_verificado)
VALUES('demo-user','Usuário de demonstração','maria.silva@email.com',
       '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
       '(11) 99999-9999',true)
ON CONFLICT (email) DO UPDATE SET senha_hash = EXCLUDED.senha_hash;

INSERT INTO establishments(id,nome,tipo,endereco,latitude,longitude,status) VALUES('hosp-sao-lucas','Hospital São Lucas','hospital','Av. Paulista, 1000',-23.5505,-46.6333,'aberto') ON CONFLICT DO NOTHING;
