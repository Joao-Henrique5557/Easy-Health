INSERT INTO users (id, nome, email, senha_hash, telefone, email_verificado)
VALUES (
    'demo-user',
    'Maria Silva',
    'maria.silva@email.com',
    '$2a$10$TkitRKaX92MNJYDjt9qDce8qyClhMW0rOZsUl48GI5gfQ2F/hoEby',
    '(11) 99999-9999',
    true
)
ON CONFLICT (email) DO UPDATE SET senha_hash = EXCLUDED.senha_hash;

INSERT INTO establishments (id, nome, tipo, endereco, latitude, longitude, status)
VALUES
    ('hosp-sao-lucas', 'Hospital São Lucas', 'hospital', 'Av. Paulista, 1000 - São Paulo', -23.5505, -46.6333, 'aberto'),
    ('upa-se', 'UPA Sé', 'upa', 'Praça da Sé, 100 - São Paulo', -23.5503, -46.6339, 'aberto'),
    ('ubs-republica', 'UBS República', 'ubs', 'Rua do Arouche, 90 - São Paulo', -23.5431, -46.6425, 'aberto')
ON CONFLICT (id) DO NOTHING;

INSERT INTO first_aid_guides (id, titulo, resumo, icon, passos, ordem)
VALUES
    ('engasgo', 'Engasgo', 'Orientações iniciais para uma situação de engasgo.', 'alert',
        ARRAY['Se a pessoa consegue tossir, incentive-a a continuar tossindo.', 'Se não consegue respirar ou falar, peça ajuda e ligue para o SAMU pelo 192.', 'Siga as orientações do atendente e procure atendimento de emergência.'], 1),
    ('queimadura', 'Queimaduras', 'Cuidados iniciais para queimaduras leves.', 'fire',
        ARRAY['Afaste a pessoa da fonte de calor com segurança.', 'Resfrie a área com água corrente fresca por 20 minutos.', 'Não use gelo, pasta de dente ou receitas caseiras.', 'Procure atendimento; ligue para o 192 em caso grave.'], 2),
    ('desmaio', 'Desmaio', 'Como agir quando alguém perde a consciência.', 'heart',
        ARRAY['Verifique se o local é seguro e chame a pessoa.', 'Se não acordar rapidamente, ligue para o SAMU pelo 192.', 'Verifique a respiração e siga as instruções do atendente.', 'Não ofereça alimentos ou líquidos enquanto a pessoa estiver inconsciente.'], 3),
    ('hemorragia', 'Sangramento intenso', 'Cuidados imediatos enquanto o socorro chega.', 'alert',
        ARRAY['Ligue para o SAMU pelo 192.', 'Com uma barreira de proteção, pressione o ferimento com pano limpo.', 'Mantenha a pressão e siga as orientações do atendente.'], 4)
ON CONFLICT (id) DO NOTHING;
