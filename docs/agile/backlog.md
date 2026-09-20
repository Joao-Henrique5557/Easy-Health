# Product Backlog do Easy Health

Backlog inicial para ser mantido no GitHub Projects, Trello ou ferramenta
equivalente. A tabela é a fonte de priorização; o status deve ser atualizado
na ferramenta escolhida. “Concluída” indica que a funcionalidade existe no
MVP atual, mas não elimina a necessidade de testes e validação do produto.

## Visão geral dos épicos

| Épico | Objetivo | Prioridade |
| --- | --- | --- |
| E1 — Acesso e perfil | Identidade, sessão e dados essenciais do usuário | P0 |
| E2 — Informação segura | Primeiros socorros e orientação responsável | P0 |
| E3 — Encontrar atendimento | Busca, localização, comparação e emergência | P0 |
| E4 — Agendar e acompanhar | Agendamento, histórico e notificações | P1 |
| E5 — Assistente | Navegação guiada sem substituir cuidado profissional | P1 |
| E6 — Evolução | Dados médicos, integrações e recursos futuros | P2 |

## Backlog priorizado

### P0 — Segurança e fluxo principal

#### EH-001 — Criar e acessar uma conta

**Épico:** E1 · **Prioridade:** P0 · **Estimativa:** 5 · **Status:** Concluída

**História:** Como pessoa usuária, quero criar uma conta e entrar com
segurança, para acessar meus dados e recursos personalizados.

**Critérios de aceitação**

- Dado um e-mail ainda não cadastrado, quando informo dados válidos, então a
  conta é criada e recebo confirmação do resultado.
- Dado um e-mail ou senha inválidos, quando tento entrar, então vejo uma
  mensagem compreensível e nenhum token é armazenado.
- Dado um acesso válido, quando entro, então sou levado à área autenticada.
- Quando o access token expira, então o refresh ocorre uma vez; se falhar,
  sessões pendentes são encerradas de forma previsível.

#### EH-002 — Consultar primeiros socorros

**Épico:** E2 · **Prioridade:** P0 · **Estimativa:** 5 · **Status:** Concluída

**História:** Como pessoa em busca de orientação imediata, quero consultar
guias simples de primeiros socorros, para saber quais são os próximos passos
sem depender de conexão perfeita.

**Critérios de aceitação**

- A lista mostra título e resumo dos guias disponíveis.
- O detalhe mostra passos ordenados e legíveis.
- Com a API indisponível, o conteúdo seguro local continua acessível.
- A tela exibe que o conteúdo é informativo e não substitui atendimento.
- Conteúdo novo só é publicado após validação definida pela equipe.

#### EH-003 — Acionar o Modo Emergência

**Épico:** E3 · **Prioridade:** P0 · **Estimativa:** 8 · **Status:** Concluída

**História:** Como pessoa em uma situação urgente, quero acessar contatos e
serviços próximos rapidamente, para buscar ajuda sem navegar por menus.

**Critérios de aceitação**

- O modo pode ser aberto sem login válido.
- São exibidos contatos oficiais configurados e estabelecimentos próximos
  quando a localização estiver disponível.
- O aplicativo nunca inicia ligação automaticamente; o usuário sempre confirma
  no discador do sistema.
- Sem internet, os contatos essenciais ainda são apresentados.
- A interface deixa claro que o app não substitui o serviço de emergência.

#### EH-004 — Buscar atendimento por localização

**Épico:** E3 · **Prioridade:** P0 · **Estimativa:** 8 · **Status:** Concluída

**História:** Como pessoa que precisa de atendimento, quero encontrar
hospitais, clínicas, UBS, UPAs e laboratórios próximos, para escolher uma opção
adequada.

**Critérios de aceitação**

- Posso pesquisar e filtrar por tipo, rede, especialidade e disponibilidade.
- Cada resultado mostra nome, endereço, distância/status e dados relevantes.
- Se eu negar localização, ainda posso pesquisar manualmente.
- Estado de carregamento, lista vazia e falha de rede têm mensagens próprias.
- Posso abrir a rota no aplicativo de mapas sem expor o token da API.

### P1 — Conversão e retenção

#### EH-005 — Comparar preço e disponibilidade

**Épico:** E3 · **Prioridade:** P1 · **Estimativa:** 5 · **Status:** Concluída

**História:** Como pessoa que compara opções, quero ver preço, convênio e
horários disponíveis, para tomar uma decisão transparente.

**Critérios de aceitação**

- O detalhe do estabelecimento diferencia serviço, valor e convênio.
- Horários indisponíveis não podem ser selecionados.
- A interface identifica quando o preço ou status é apenas informativo.
- Falha no carregamento não apresenta valores como se fossem atuais.

#### EH-006 — Agendar e cancelar uma consulta

**Épico:** E4 · **Prioridade:** P1 · **Estimativa:** 8 · **Status:** Concluída

**História:** Como pessoa usuária, quero escolher um horário e confirmar ou
cancelar um agendamento, para organizar meu atendimento.

**Critérios de aceitação**

- Só posso confirmar um horário retornado como disponível.
- Antes de confirmar, vejo estabelecimento, especialidade, profissional,
  data, horário e valor.
- Uma confirmação gera um registro consultável no histórico de agendamentos.
- Cancelamento pede confirmação e atualiza o status sem apagar o registro.
- Erros de conflito ou indisponibilidade explicam que devo escolher outro
  horário.

#### EH-007 — Consultar histórico de saúde

**Épico:** E4 · **Prioridade:** P1 · **Estimativa:** 5 · **Status:** Concluída

**História:** Como pessoa usuária, quero consultar minhas consultas e
informações registradas, para acompanhar minha jornada de saúde.

**Critérios de aceitação**

- Vejo somente dados associados à minha conta.
- Consultas são ordenadas por data e distinguem realizadas de agendadas.
- Estados vazio, carregando e erro são explícitos.
- O app não inventa exames, documentos ou diagnósticos ausentes.

#### EH-008 — Receber e marcar notificações

**Épico:** E4 · **Prioridade:** P1 · **Estimativa:** 3 · **Status:** Concluída

**História:** Como pessoa usuária, quero consultar notificações e marcá-las
como lidas, para não perder atualizações do meu atendimento.

**Critérios de aceitação**

- Notificações não lidas são visualmente distinguíveis.
- Tocar em uma notificação a marca como lida de forma otimista e consistente.
- Falha ao sincronizar não apaga silenciosamente a informação local.
- Cada usuário acessa apenas suas próprias notificações.

#### EH-009 — Usar o assistente para navegar

**Épico:** E5 · **Prioridade:** P1 · **Estimativa:** 8 · **Status:** Concluída

**História:** Como pessoa usuária, quero descrever o que preciso em linguagem
natural, para chegar rapidamente à tela correta.

**Critérios de aceitação**

- A resposta pode sugerir uma tela suportada sem exigir que eu conheça o menu.
- O backend recebe a chave da IA somente no servidor.
- Sem chave ou com falha da IA, recebo uma resposta segura e o app não trava.
- A conversa não apresenta diagnóstico, prescrição ou falsa certeza.
- Sinais de emergência são tratados localmente antes da chamada de rede.

### P2 — Evolução controlada

#### EH-010 — Gerenciar favoritos

**Épico:** E3 · **Prioridade:** P2 · **Estimativa:** 3 · **Status:** Concluída

**História:** Como pessoa usuária, quero favoritar estabelecimentos, para
reencontrá-los rapidamente.

**Critérios de aceitação**

- Posso adicionar e remover um estabelecimento sem duplicar o favorito.
- A lista é persistida por usuário.
- Uma falha de rede informa o resultado real, sem confirmar uma alteração não
  persistida.

#### EH-011 — Recuperar acesso à conta

**Épico:** E1 · **Prioridade:** P2 · **Estimativa:** 5 · **Status:** Concluída

**História:** Como pessoa que esqueceu a senha, quero recuperar o acesso de
forma segura, para voltar a usar minha conta.

**Critérios de aceitação**

- O código de recuperação expira e só pode ser usado uma vez.
- A resposta não revela se um e-mail existe no sistema.
- A nova senha atende às regras definidas e invalida sessões conforme a política.

#### EH-012 — Exportar e integrar dados de saúde

**Épico:** E6 · **Prioridade:** P2 · **Estimativa:** 13 · **Status:** Futuro

**História:** Como pessoa usuária, quero exportar documentos e integrar dados
com serviços autorizados, para manter meu histórico portátil.

**Critérios de aceitação**

- O usuário escolhe quais dados exportar e confirma a operação.
- O arquivo não fica publicamente acessível e possui expiração/controle de
  acesso.
- O sistema registra consentimento e permite revogação quando aplicável.
- Integrações oficiais só entram após análise legal, técnica e de segurança.

## Ordem sugerida das próximas Sprints

O MVP já está implementado; portanto, a prioridade imediata deve ser validar e
reduzir risco, não adicionar escopo indiscriminadamente.

| Sprint | Objetivo | Itens |
| --- | --- | --- |
| 1 | Validar o caminho crítico | EH-001, EH-002, EH-003 e EH-004: testes de integração, offline, acessibilidade e conteúdo. |
| 2 | Tornar o agendamento demonstrável | EH-005, EH-006 e EH-008: conflitos, cancelamento, notificações e evidências de Review. |
| 3 | Fechar qualidade do produto | EH-007, EH-009, EH-010 e EH-011: privacidade, fallback, observabilidade e testes de regressão. |
| 4 | Aprender antes de expandir | Entrevistas/testes com usuários, métricas do MVP e refinamento de EH-012. |

O PO pode alterar a ordem, mas deve registrar o motivo no histórico do backlog.
