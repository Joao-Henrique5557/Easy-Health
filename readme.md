# Easy Health

> Plataforma integrada de saúde que centraliza informações, organização de dados de saúde e busca por atendimentos públicos e privados em um único aplicativo.

---

## 1. Visão do Projeto

O **Easy Health** é uma plataforma digital desenvolvida para facilitar o acesso da população a informações e serviços relacionados à saúde.

A proposta é reunir, em um único aplicativo, funcionalidades que atualmente estão distribuídas entre diferentes plataformas, como:

- Informações de saúde.
- Primeiros socorros.
- Histórico de consultas e exames.
- Busca por hospitais e clínicas.
- Informações sobre preços.
- Disponibilidade de atendimentos.
- Agendamento de consultas.
- Localização de serviços de saúde.
- Recursos para situações de emergência.

O objetivo é proporcionar uma experiência **mais simples, rápida, integrada e transparente** para o usuário.

---

# 2. Problema

O sistema de saúde brasileiro enfrenta diversos desafios relacionados ao acesso, organização e disponibilidade de informações.

Entre os principais problemas estão:

- Falta de acesso rápido à informação.
- Necessidade de utilizar diferentes aplicativos para diferentes serviços.
- Busca de informações em diversos sites e plataformas.
- Desorganização no acompanhamento de exames e consultas.
- Dificuldade para encontrar atendimento, especialmente em situações de urgência.
- Falta de conhecimento da população sobre primeiros socorros.
- Pouca transparência sobre preços de serviços privados.
- Dificuldade para verificar a disponibilidade de consultas.
- Informações de saúde distribuídas em diferentes sistemas.

Como consequência, o usuário pode perder tempo procurando informações ou tentando descobrir onde e como conseguir atendimento.

---

# 3. Solução

O Easy Health propõe uma **plataforma única de saúde**, funcionando como um hub que conecta informação, organização e atendimento.

A plataforma busca centralizar:

```text
                    EASY HEALTH
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
  INFORMAÇÃO         ORGANIZAÇÃO       ATENDIMENTO
       │                 │                 │
       ├─ Saúde          ├─ Perfil        ├─ Hospitais
       ├─ Primeiros      ├─ Consultas     ├─ Clínicas
       │  socorros       ├─ Exames        ├─ UBS
       └─ Guias          └─ Histórico     ├─ UPAs
                                          └─ Laboratórios
                                                │
                                                ▼
                                      PREÇOS / DISPONIBILIDADE
                                                │
                                                ▼
                                           AGENDAMENTO
```

A proposta não é apenas criar um aplicativo para consultas, mas desenvolver um **hub completo de saúde**.

---

# 4. Objetivos

## Objetivo geral

Facilitar o acesso da população a informações e serviços de saúde por meio de uma plataforma integrada, simples e acessível.

## Objetivos específicos

- Centralizar informações de saúde.
- Facilitar a busca por atendimento.
- Reduzir o tempo gasto procurando serviços médicos.
- Organizar informações pessoais de saúde.
- Disponibilizar conteúdos educativos sobre primeiros socorros.
- Aumentar a transparência no setor privado.
- Facilitar a comparação entre diferentes serviços.
- Auxiliar usuários em situações de emergência.
- Integrar serviços públicos e privados em uma experiência única.

---

# 5. Público-Alvo

O Easy Health pode atender diferentes perfis de usuários:

- Pessoas que utilizam o SUS.
- Usuários de planos de saúde.
- Pessoas que utilizam serviços particulares.
- Pessoas que precisam encontrar atendimento rapidamente.
- Familiares e cuidadores.
- Usuários que desejam organizar suas informações de saúde.
- Pessoas que buscam informações básicas sobre primeiros socorros.

---

# 6. Funcionalidades

## 6.1 Cadastro de usuário

Permite criar uma conta para utilizar recursos personalizados.

Possíveis informações:

- Nome.
- E-mail.
- Telefone.
- Data de nascimento.
- Informações básicas de perfil.

Futuramente, poderá existir integração com sistemas oficiais de saúde, respeitando os requisitos legais e de segurança aplicáveis.

---

## 6.2 Primeiros socorros

Área destinada ao acesso rápido a informações educativas sobre primeiros socorros.

Exemplos:

- Desmaios.
- Engasgos.
- Crises respiratórias.
- Convulsões.
- Hemorragias.
- Queimaduras.
- Parada cardiorrespiratória.

O conteúdo poderá incluir:

- Guias passo a passo.
- Vídeos.
- Ilustrações.
- Instruções rápidas.

> O conteúdo deve ser validado por profissionais qualificados e não substitui atendimento médico profissional.

---

## 6.3 Histórico de saúde

Área destinada à organização das informações de saúde do usuário.

Possíveis recursos:

- Consultas.
- Exames.
- Resultados.
- Vacinas.
- Medicamentos.
- Documentos médicos.

Em versões futuras, os dados poderão ser obtidos por meio de integrações com sistemas oficiais.

---

## 6.4 Busca por atendimento

Permite localizar serviços de saúde próximos.

Exemplos:

- Hospitais.
- Clínicas.
- UBS.
- UPAs.
- Laboratórios.
- Consultórios.

A busca poderá utilizar filtros como:

- Distância.
- Especialidade.
- Tipo de atendimento.
- Preço.
- Disponibilidade.
- Horário de funcionamento.

---

## 6.5 Preços e disponibilidade

Para serviços privados, a plataforma poderá apresentar:

- Preço da consulta.
- Especialidade.
- Horários disponíveis.
- Serviços oferecidos.
- Convênios aceitos.

O objetivo é aumentar a transparência e permitir que o usuário compare diferentes opções.

---

## 6.6 Agendamento

Quando houver integração com o estabelecimento, o usuário poderá:

1. Encontrar um serviço.
2. Consultar horários disponíveis.
3. Selecionar um horário.
4. Realizar o agendamento.
5. Consultar seus próximos atendimentos.

---

## 6.7 Modo de emergência

O aplicativo terá uma experiência otimizada para situações em que o usuário precisa de informação rapidamente.

Possíveis recursos:

- Acesso rápido aos primeiros socorros.
- Localização de hospitais e UPAs.
- Informações de contato.
- Rotas.
- Serviços de emergência próximos.
- Interface simplificada.

---

## 6.8 Assistente de IA (Easy Health Assistant)

Um assistente conversacional integrado ao aplicativo, com dois papéis principais: **guiar o usuário pelo app** e **atuar como suporte de emergência 24h**.

### Navegação guiada

- O usuário descreve o que precisa em linguagem natural (ex.: _"quero achar um pediatra perto de mim"_, _"onde vejo meus exames?"_, _"como faço para agendar uma consulta?"_).
- A IA identifica a intenção e redireciona o usuário diretamente para a tela ou fluxo correspondente do app (deep link), em vez de apenas explicar em texto.
- Também responde dúvidas gerais sobre como cada funcionalidade do app funciona, atuando como um "guia" permanente e contextual, reduzindo a curva de aprendizado do aplicativo.

### Suporte 24h em situações de emergência

- Funciona como uma camada de apoio disponível a qualquer hora, com um modo dedicado para emergências de saúde.
- Ao detectar sinais de uma situação de emergência na conversa, a IA prioriza imediatamente:
  1. Orientar o usuário a acionar os serviços de emergência reais (ex.: SAMU 192, Bombeiros 193, Polícia 190).
  2. Localizar e indicar a rota até o hospital/UPA mais próximo.
  3. Exibir instruções básicas de primeiros socorros — sempre conteúdo previamente validado por profissionais de saúde — enquanto o socorro não chega.
- A IA **nunca substitui** atendimento médico, diagnóstico ou os serviços de emergência oficiais; sua função é orientar, acelerar o acesso à informação certa e nunca atrasar o contato com socorro real.

### Segurança e ética

- Respostas relacionadas à saúde são tratadas como **informativas**, nunca como diagnóstico ou prescrição.
- Todo conteúdo usado pela IA em primeiros socorros/emergência segue a mesma exigência de validação profissional descrita na seção 19.
- Disclaimers claros e visíveis em qualquer resposta relacionada a saúde ou emergência.
- Conversas com a IA são tratadas como dado sensível de saúde, com minimização de retenção e criptografia (ver seção 14).
- Em caso de dúvida sobre a gravidade da situação, a IA deve sempre pender para orientar o acionamento de serviços reais.
- A ligação nunca é feita automaticamente pelo app — a IA só orienta; quem disca é sempre o usuário, tocando no número (ver `frontend/src/services/emergencyService.ts`).

### Implementação

O assistente é implementado como um componente no app (`AssistantFab` + `AssistantPanel`) que chama a rota `POST /api/assistant/message` do backend (seção 22.11), a qual por sua vez chama a API da Claude (Anthropic) do lado do servidor. A detecção de emergência roda **localmente no app**, por palavras-chave, antes de qualquer chamada de rede — garante que o usuário chegue à tela de emergência mesmo offline ou se a IA estiver indisponível.

---

# 7. Estratégia do Oceano Azul

A estratégia do **Oceano Azul** busca criar uma nova proposta de valor em vez de competir apenas com base nas mesmas características oferecidas pelos concorrentes.

Para o Easy Health, essa estratégia é estruturada por meio do **Modelo das Quatro Ações**.

---

# 8. Modelo das Quatro Ações

## 8.1 Eliminar

O Easy Health busca eliminar fatores que tornam a experiência do usuário fragmentada.

### Elementos eliminados ou reduzidos da experiência atual

- Uso de vários aplicativos para diferentes serviços de saúde.
- Busca de informações em diversos sites e plataformas.
- Falta de transparência sobre preços.
- Dificuldade para descobrir a disponibilidade de atendimentos.

A proposta é concentrar essas informações em uma única experiência.

---

## 8.2 Reduzir

O produto busca reduzir:

- Tempo gasto na busca por atendimento médico.
- Complexidade no acesso às informações de saúde.
- Dificuldade na organização de exames.
- Dificuldade na organização de consultas.
- Fragmentação do histórico médico.

---

## 8.3 Elevar

O Easy Health pretende elevar:

- Facilidade de uso da plataforma.
- Rapidez no acesso a informações em situações de emergência.
- Transparência sobre preços.
- Transparência sobre disponibilidade de consultas.
- Integração entre serviços de saúde.

---

## 8.4 Criar

O projeto propõe criar:

- Plataforma integrada de informações, organização e atendimento em saúde.
- Área de primeiros socorros com vídeos e guias explicativos.
- Sistema de comparação de preços entre clínicas e consultas.
- Centralização de informações e serviços do SUS e da rede privada.
- Experiência de atendimento orientada à localização e disponibilidade.

---

# 9. Matriz de Avaliação de Valor

A matriz compara atributos relevantes do mercado atual com a proposta do Easy Health.

| Atributo de Valor                 | Aplicativos Atuais | Easy Health |
| --------------------------------- | -----------------: | ----------: |
| Agendamento de consultas          |               Alto |        Alto |
| Histórico de saúde                |              Médio |        Alto |
| Informações de primeiros socorros |              Baixo |        Alto |
| Comparação de preços              |              Baixo |        Alto |
| Integração de serviços            |              Baixo |  Muito Alto |
| Facilidade de uso                 |              Médio |        Alto |
| Atendimento de emergência         |              Baixo |        Alto |
| Centralização de informações      |              Baixo |  Muito Alto |

### Interpretação

O Easy Health busca competir de forma diferente ao elevar atributos que normalmente possuem menor presença em soluções isoladas.

Os principais pontos de diferenciação são:

**Integração de serviços**

Conectar diferentes funcionalidades em uma única plataforma.

**Centralização**

Reduzir a necessidade de alternar entre aplicativos, sites e serviços diferentes.

**Primeiros socorros**

Adicionar uma dimensão educacional e preventiva que normalmente não é o foco principal de plataformas de agendamento.

**Transparência**

Facilitar a visualização e comparação de preços e disponibilidade no setor privado.

**Emergência**

Priorizar velocidade e simplicidade de acesso quando o usuário estiver em uma situação crítica.

---

# 10. Diferencial Competitivo

Atualmente existem plataformas especializadas em diferentes partes da jornada de saúde.

Exemplos:

- **Conecte SUS** → serviços e informações relacionadas ao sistema público.
- **Doctoralia** → busca e agendamento de consultas.
- **Easy Health** → proposta de integração entre informação, organização, atendimento e primeiros socorros.

O diferencial não está necessariamente em oferecer uma funcionalidade completamente inédita, mas em **combinar funcionalidades existentes de maneira integrada e orientada à experiência do usuário**.

### Proposta de valor

> **"Tudo o que você precisa para encontrar, organizar e acessar informações e serviços de saúde em um só lugar."**

---

# 11. Benefícios para o Usuário

O Easy Health busca proporcionar:

### Praticidade

Menos aplicativos e sites para consultar.

### Rapidez

Acesso rápido a informações e serviços.

### Organização

Centralização de consultas, exames e informações pessoais.

### Transparência

Maior visibilidade sobre preços e disponibilidade.

### Acessibilidade

Interface simples e fácil de utilizar.

### Segurança

Informações importantes disponíveis rapidamente em situações de emergência.

---

# 12. Arquitetura Conceitual

Arquitetura implementada:

```text
┌─────────────────────────────┐
│       Easy Health App       │
│     React Native / Expo     │
└──────────────┬──────────────┘
               │  HTTPS / JWT (Bearer Token)
               ▼
┌─────────────────────────────┐
│      Backend (Express)      │
│   Node.js + TypeScript      │
└───────┬───────────┬─────────┘
        │           │
        ▼           ▼
┌────────────┐ ┌───────────────┐
│ PostgreSQL │ │ Serviços      │
│ (Prisma)   │ │ Externos      │
└────────────┘ └───────┬───────┘
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
       Nominatim   Anthropic   (futuro: CNES/
       (mapas)     (IA)         DATASUS, Places)
```

Todo o backend + banco sobe com um único `docker compose up` (ver seção 23). Detalhes de cada camada em `backend/README.md` e `frontend/README.md`.

---

# 13. Tecnologias

Stack efetivamente usada no projeto:

## Mobile

- React Native + Expo
- TypeScript
- React Navigation (stack + bottom tabs)
- axios (com interceptors de autenticação)
- expo-location, expo-notifications, expo-secure-store, Linking (APIs nativas do Android/iOS)

## Backend

- Node.js + TypeScript
- Express (REST API)
- Prisma ORM
- JWT (access + refresh token com rotação)
- Zod (validação de entrada)

## Banco de dados

- PostgreSQL

## Infraestrutura

- Docker + Docker Compose (banco + API + Adminer)
- Git + GitHub
- REST Client (VS Code) para testar a API manualmente (`backend/requests/`)
- CI/CD: não implementado ainda (ver seção 21 — Status)

## Serviços externos

- **Nominatim (OpenStreetMap)** — geocodificação, sem exigir chave de API.
- **Anthropic (Claude)** — Assistente de IA (seção 6.8), chamado só pelo backend.
- Ainda não integrados (roadmap): CNES/DATASUS (rede pública real), Google Places (rede privada real), FCM/OneSignal (push notifications em produção).

---

# 14. Segurança e Privacidade

Como o sistema poderá lidar com dados pessoais e informações relacionadas à saúde, segurança e privacidade são requisitos fundamentais.

O projeto deverá considerar:

- Autenticação segura.
- Autorização baseada em permissões.
- Criptografia.
- Proteção de dados pessoais.
- Controle de acesso.
- Logs e auditoria.
- Backups.
- Minimização da coleta de dados.
- Conformidade com a LGPD.
- Proteção específica para dados relacionados à saúde.

Integrações com sistemas governamentais ou dados médicos reais somente deverão ser implementadas após análise dos requisitos legais, técnicos e de segurança aplicáveis.

---

# 15. MVP

O primeiro MVP deve concentrar-se nas funcionalidades essenciais da proposta.

### Prioridade alta

- [x] Cadastro e login.
- [x] Perfil do usuário.
- [x] Área de primeiros socorros.
- [x] Busca por hospitais e clínicas.
- [x] Localização dos estabelecimentos.
- [x] Informações básicas dos estabelecimentos.
- [x] Modo de emergência.

### Prioridade média

- [x] Sistema de agendamento.
- [x] Informações de preços.
- [x] Disponibilidade de horários.
- [x] Filtros de pesquisa.
- [x] Favoritos.

### Prioridade futura

- [x] Histórico de consultas.
- [ ] Histórico de exames. _(rota implementada, sem tabela própria ainda — ver `backend/README.md`)_
- [ ] Documentos médicos. _(idem)_
- [ ] Comparação avançada de preços.
- [ ] Integração com serviços públicos (CNES/DATASUS real).
- [ ] Integração com estabelecimentos privados (Google Places real).
- [ ] Integrações com sistemas oficiais (RNDS).

---

# 16. Roadmap

## Fase 1 — Fundação

- [x] Definição dos requisitos.
- [x] Definição da arquitetura.
- [x] Prototipação da interface.
- [x] Configuração do repositório.
- [x] Configuração do ambiente de desenvolvimento (Docker Compose).
- [ ] Configuração inicial do CI/CD.

## Fase 2 — MVP

- [x] Cadastro.
- [x] Login.
- [x] Perfil.
- [x] Primeiros socorros.
- [x] Busca por atendimento.
- [x] Localização.
- [x] Modo de emergência.

## Fase 3 — Serviços

- [x] Agendamento.
- [x] Preços.
- [x] Disponibilidade.
- [ ] Comparação (avançada, entre múltiplos estabelecimentos).
- [x] Favoritos.

## Fase 4 — Organização da saúde

- [x] Consultas.
- [ ] Exames.
- [ ] Histórico. _(consultas prontas; exames/vacinas/medicamentos ainda não)_
- [ ] Documentos.
- [ ] Medicamentos.

## Fase 5 — Integrações

- [x] APIs externas (Nominatim para geocodificação; Anthropic para o Assistente de IA).
- [ ] Estabelecimentos privados (Google Places real).
- [ ] Serviços públicos (CNES/DATASUS real).
- [ ] Sistemas oficiais, quando tecnicamente e legalmente possível (RNDS).

## Fase 6 — Assistente de IA

- [x] Navegação guiada por linguagem natural.
- [x] Roteamento de intenções para telas do app.
- [x] Detecção de sinais de emergência (local, no app, antes de qualquer chamada de rede).
- [x] Backend chamando a API da Claude (Anthropic) do lado do servidor.
- [ ] Base de conhecimento (RAG) sobre funcionalidades do app — hoje o conhecimento vem só do prompt de sistema.

---

# 17. Desenvolvimento Ágil

O desenvolvimento do Easy Health deve ser realizado de maneira incremental e iterativa.

O projeto pode utilizar um fluxo baseado em:

```text
Requisitos
    ↓
Product Backlog
    ↓
Priorização
    ↓
Sprint
    ↓
Desenvolvimento
    ↓
Code Review
    ↓
Testes
    ↓
Deploy
    ↓
Feedback
    ↓
Retrospectiva
    ↓
Próxima Sprint
```

As funcionalidades devem ser divididas em **épicos, histórias de usuário e tarefas**, permitindo que o produto evolua gradualmente.

Exemplo:

```text
Épico: Atendimento

└── História de usuário
    └── Como usuário,
        quero encontrar hospitais próximos,
        para conseguir atendimento rapidamente.

        ├── Criar API de busca
        ├── Integrar localização
        ├── Criar tela de resultados
        ├── Implementar filtros
        └── Criar testes
```

---

# 18. Equipe e Organização do Projeto

O Easy Health é desenvolvido por uma equipe de 7 pessoas, na disciplina de Empreendedorismo (IFAL), seguindo uma organização baseada em Scrum + DevOps (ver metodologia completa em `docs/distribuicao-cargos-projeto-empreendedorismo.md`).

| Papel                   | Responsável                    | Frente principal                                                        |
| ----------------------- | ------------------------------ | ----------------------------------------------------------------------- |
| Product Owner (PO)      | Cássio                         | Define a ideia de negócio, prioriza o backlog, representa o "cliente"   |
| Scrum Master            | Caio                           | Organiza reuniões (daily, planning, review, retro), remove impedimentos |
| Dev Mobile 1            | Alex                           | Telas, navegação e consumo da API no app React Native                   |
| Dev Mobile 2            | Maxuel                         | Telas, navegação e consumo da API no app React Native                   |
| Backend                 | Isabela                        | API, banco de dados, regras de negócio, autenticação                    |
| DevOps / Infraestrutura | João Henrique (`joaohenrique`) | Git (branches/PRs), Docker/Docker Compose, CI/CD                        |
| UI/UX Design            | Adriel Vinicius                | Wireframes, protótipo no Figma, identidade visual                       |

Em um time de 7 pessoas para 7 frentes, cada integrante assume um papel "dono" e ajuda em pelo menos uma outra frente — ninguém fica isolado só na própria função.

---

# 19. Segurança e Responsabilidade Médica

O Easy Health não substitui:

- Médicos.
- Enfermeiros.
- Serviços de emergência.
- Hospitais.
- Unidades de pronto atendimento.
- Orientação profissional.

O conteúdo educativo deve ser tratado como material informativo.

Especialmente na área de primeiros socorros, informações incorretas podem causar danos. Por isso, conteúdos destinados ao uso em situações reais devem passar por **validação de profissionais qualificados**.

---

# 20. Conclusão

O **Easy Health** apresenta uma proposta baseada na integração de recursos que atualmente estão distribuídos entre diferentes aplicativos, sites e serviços.

A estratégia de **Oceano Azul** busca criar valor por meio da combinação de:

- Informação.
- Educação em saúde.
- Primeiros socorros.
- Organização de dados.
- Busca por atendimento.
- Transparência de preços.
- Disponibilidade.
- Agendamento.
- Integração entre serviços públicos e privados.

A principal oportunidade está em transformar uma jornada fragmentada em uma experiência centralizada.

Dessa forma, o Easy Health busca oferecer **mais praticidade, rapidez, organização e transparência**, diferenciando-se de soluções que atuam apenas em partes específicas do ecossistema de saúde.

> **Easy Health — saúde mais simples, integrada e acessível.**

---

# 21. Status

**Status:** MVP implementado (frontend + backend + infraestrutura Docker) — validação e testes em andamento.

- Frontend (React Native/Expo): todas as telas do design implementadas e conectadas ao backend, com fallback local para conteúdo de segurança (primeiros socorros) e dados de demonstração.
- Backend (Node.js/TypeScript/Express/Prisma/PostgreSQL): todas as rotas da seção 22 implementadas, incluindo a rota do Assistente de IA.
- Infraestrutura: `docker-compose.yml` sobe banco + API + UI de administração do banco com um único comando (ver seção 23).
- Pendências: login social (OAuth real), upload de arquivos (foto de perfil, documentos médicos), geração de PDF de receita, integração com sistemas oficiais de saúde (RNDS) — ver roadmap (seção 16) e `backend/README.md`/`frontend/README.md` para o detalhamento técnico de cada pendência.

---

# 22. Rotas de API

Com base nas telas e funcionalidades mapeadas (onboarding, login, cadastro, home, primeiros socorros, busca de atendimento, modo emergência, perfil, agendamento, histórico de saúde, notificações e favoritos), o backend do Easy Health expõe as rotas REST listadas abaixo. Todas as rotas (exceto autenticação, conteúdo público e modo de emergência) exigem um token de acesso válido (Bearer Token / JWT).

> **Status:** implementado em `backend/` (Node.js + TypeScript + Express + Prisma + PostgreSQL). Cada subseção abaixo corresponde a um módulo em `backend/src/modules/`.

## 22.1 Autenticação (login, cadastro, recuperação de senha)

| Método | Rota                        | Descrição                                    |
| ------ | --------------------------- | -------------------------------------------- |
| POST   | `/api/auth/register`        | Cria uma nova conta de usuário (cadastro)    |
| POST   | `/api/auth/login`           | Autentica o usuário e retorna o token        |
| POST   | `/api/auth/logout`          | Invalida a sessão/token atual                |
| POST   | `/api/auth/refresh-token`   | Gera um novo token a partir do refresh token |
| POST   | `/api/auth/forgot-password` | Envia código/link de recuperação de senha    |
| POST   | `/api/auth/reset-password`  | Redefine a senha usando o código enviado     |
| POST   | `/api/auth/verify-email`    | Confirma o e-mail cadastrado                 |

## 22.2 Perfil do usuário

| Método | Rota                         | Descrição                                  |
| ------ | ---------------------------- | ------------------------------------------ |
| GET    | `/api/users/me`              | Retorna os dados do usuário logado         |
| PUT    | `/api/users/me`              | Atualiza dados do perfil (editar-perfil)   |
| PATCH  | `/api/users/me/avatar`       | Atualiza a foto de perfil                  |
| PUT    | `/api/users/me/password`     | Altera a senha do usuário logado           |
| DELETE | `/api/users/me`              | Exclui a conta do usuário                  |
| GET    | `/api/users/me/preferencias` | Retorna preferências/configurações do app  |
| PUT    | `/api/users/me/preferencias` | Atualiza preferências/configurações do app |

## 22.3 Primeiros socorros

| Método | Rota                                   | Descrição                                    |
| ------ | -------------------------------------- | -------------------------------------------- |
| GET    | `/api/primeiros-socorros`              | Lista todos os guias de primeiros socorros   |
| GET    | `/api/primeiros-socorros/categorias`   | Lista categorias (engasgo, queimadura, etc.) |
| GET    | `/api/primeiros-socorros/:id`          | Retorna o detalhe de um guia específico      |
| GET    | `/api/primeiros-socorros/busca?query=` | Busca guias por palavra-chave                |

## 22.4 Busca de atendimento / Estabelecimentos

| Método | Rota                                             | Descrição                                                                           |
| ------ | ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| GET    | `/api/estabelecimentos`                          | Lista estabelecimentos (hospitais, clínicas, UBS, UPAs, laboratórios)               |
| GET    | `/api/estabelecimentos/busca`                    | Busca com filtros (distância, especialidade, tipo, preço, disponibilidade, horário) |
| GET    | `/api/estabelecimentos/:id`                      | Retorna o detalhe de um estabelecimento                                             |
| GET    | `/api/estabelecimentos/:id/especialidades`       | Lista especialidades oferecidas pelo estabelecimento                                |
| GET    | `/api/estabelecimentos/:id/precos`               | Lista preços de consultas/serviços do estabelecimento                               |
| GET    | `/api/estabelecimentos/:id/horarios-disponiveis` | Lista horários disponíveis para agendamento                                         |
| GET    | `/api/especialidades`                            | Lista geral de especialidades médicas (para filtros)                                |

## 22.5 Modo de emergência

| Método | Rota                                 | Descrição                                              |
| ------ | ------------------------------------ | ------------------------------------------------------ |
| GET    | `/api/emergencia/hospitais-proximos` | Lista hospitais/UPAs mais próximos do usuário          |
| GET    | `/api/emergencia/contatos`           | Retorna contatos de emergência (SAMU, Bombeiros, etc.) |
| GET    | `/api/emergencia/rotas`              | Retorna rota até o estabelecimento mais próximo        |

## 22.6 Agendamento

| Método | Rota                              | Descrição                                       |
| ------ | --------------------------------- | ----------------------------------------------- |
| GET    | `/api/agendamentos`               | Lista os agendamentos do usuário logado         |
| POST   | `/api/agendamentos`               | Cria um novo agendamento                        |
| GET    | `/api/agendamentos/:id`           | Retorna o detalhe/confirmação de um agendamento |
| PUT    | `/api/agendamentos/:id`           | Reagenda (altera data/horário) um agendamento   |
| DELETE | `/api/agendamentos/:id`           | Cancela um agendamento                          |
| POST   | `/api/agendamentos/:id/confirmar` | Confirma o agendamento realizado                |

## 22.7 Histórico de saúde

| Método | Rota                            | Descrição                                      |
| ------ | ------------------------------- | ---------------------------------------------- |
| GET    | `/api/historico/consultas`      | Lista o histórico de consultas do usuário      |
| GET    | `/api/historico/consultas/:id`  | Retorna o detalhe de uma consulta              |
| POST   | `/api/historico/consultas`      | Adiciona uma consulta manualmente ao histórico |
| GET    | `/api/historico/exames`         | Lista o histórico de exames                    |
| GET    | `/api/historico/exames/:id`     | Retorna o detalhe/resultado de um exame        |
| POST   | `/api/historico/exames`         | Adiciona um exame ao histórico                 |
| GET    | `/api/historico/vacinas`        | Lista o histórico de vacinas                   |
| GET    | `/api/historico/medicamentos`   | Lista medicamentos em uso/histórico            |
| GET    | `/api/historico/documentos`     | Lista documentos médicos do usuário            |
| POST   | `/api/historico/documentos`     | Faz upload de um documento médico              |
| DELETE | `/api/historico/documentos/:id` | Remove um documento médico                     |

## 22.8 Favoritos

| Método | Rota                 | Descrição                                 |
| ------ | -------------------- | ----------------------------------------- |
| GET    | `/api/favoritos`     | Lista os estabelecimentos favoritados     |
| POST   | `/api/favoritos`     | Adiciona um estabelecimento aos favoritos |
| DELETE | `/api/favoritos/:id` | Remove um estabelecimento dos favoritos   |

## 22.9 Notificações

| Método | Rota                                   | Descrição                              |
| ------ | -------------------------------------- | -------------------------------------- |
| GET    | `/api/notificacoes`                    | Lista as notificações do usuário       |
| PUT    | `/api/notificacoes/:id/lida`           | Marca uma notificação como lida        |
| PUT    | `/api/notificacoes/marcar-todas-lidas` | Marca todas as notificações como lidas |
| DELETE | `/api/notificacoes/:id`                | Remove uma notificação                 |

## 22.10 Localização / Mapas (uso interno, integração com serviços externos)

| Método | Rota                               | Descrição                                              |
| ------ | ---------------------------------- | ------------------------------------------------------ |
| GET    | `/api/localizacao/geocode`         | Converte endereço em coordenadas                       |
| GET    | `/api/localizacao/reverse-geocode` | Converte coordenadas em endereço                       |
| GET    | `/api/localizacao/distancia`       | Calcula distância entre o usuário e um estabelecimento |

## 22.11 Assistente de IA

Rota adicional, não prevista no mapeamento original das telas (criada para viabilizar a funcionalidade descrita na seção 6.8). Diferente das outras, o corpo da resposta não é o dado bruto do banco — é gerado por um modelo de IA (Claude, da Anthropic) com um prompt de sistema que conhece as telas do app.

| Método | Rota                     | Descrição                                                           |
| ------ | ------------------------ | ------------------------------------------------------------------- |
| POST   | `/api/assistant/message` | Envia uma mensagem do usuário e recebe uma resposta + tela sugerida |

A chamada para a API da Anthropic acontece **inteiramente no backend** — o app nunca tem acesso à chave de API, só ao endpoint acima (ver seção 6.8 e `backend/src/modules/assistant`).

> Observação: os nomes e a organização exata das rotas (versionamento como `/api/v1/...`, nomenclatura em inglês, etc.) poderão ser ajustados conforme a evolução do backend. Esta lista mapeia, a partir das telas do protótipo, todos os recursos que a API disponibiliza para o MVP e para as fases futuras do roadmap.

---

# 23. Como Rodar o Projeto

O jeito mais rápido de rodar o Easy Health inteiro (banco + backend) é via Docker Compose, na raiz do repositório:

```bash
cp .env.example .env
# edite o .env se quiser (principalmente ANTHROPIC_API_KEY, para testar o Assistente de IA)
docker compose up --build
```

Isso sobe:

| Serviço   | Porta padrão | O que é                         |
| --------- | ------------ | ------------------------------- |
| `db`      | 5432         | PostgreSQL                      |
| `backend` | 3333         | API REST (seção 22)             |
| `adminer` | 8080         | UI web para inspecionar o banco |

No primeiro start, o backend aplica as migrations do Prisma e popula o banco com dados de demonstração automaticamente (usuário `maria.silva@email.com` / senha `senha123`, estabelecimentos e guias de primeiros socorros com o mesmo conteúdo do design). Detalhes em `backend/README.md`.

Com o backend no ar, rode o app:

```bash
cd frontend
npm install
npx expo start
```

E aponte `frontend/app.json` → `expo.extra.apiUrl` para o endereço correto do backend a partir de onde o app está rodando (emulador, celular físico ou navegador têm endereços diferentes — ver `frontend/README.md`).

Para testar as rotas da API isoladamente, sem precisar do app, use os arquivos em `backend/requests/` com a extensão **REST Client** do VS Code.

---

# 24. Licença

Este projeto está licenciado sob a licença MIT — ver o arquivo [`LICENSE`](./LICENSE) na raiz do repositório para o texto completo.
