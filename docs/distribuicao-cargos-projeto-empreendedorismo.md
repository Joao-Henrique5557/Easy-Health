# Distribuição de Cargos — Projeto de Empreendedorismo (IFAL)

## Enunciado

Em alguns dias vou começar um projeto da disciplina de Empreendedorismo no IFAL, com no máximo 7 colegas. Até agora não temos a lista completa de tecnologias e o design definidos, mas isso está em análise. Acredito que iremos utilizar o React Native, além do que o grupo escolher, já que é um trabalho de criar uma ideia nova no mercado e implementá-la. Vamos usar Git e Docker. Como ficaria a distribuição de cargos para essas 7 pessoas caso utilizássemos uma organização seguindo conceitos de desenvolvimento ágil e DevOps?

---

## Resposta

Com 7 pessoas, o segredo é não tentar criar 7 cargos isolados, mas sim 7 papéis que se cruzam, porque em um time pequeno todo mundo também precisa colocar a mão no código. Abaixo está uma proposta de organização.

### 1. Estrutura de papéis (Scrum + DevOps)

| Nº | Papel | Responsabilidade principal | Envolvimento técnico |
|----|-------|----------------------------|----------------------|
| 1 | **Product Owner (PO)** | Define o que é a ideia de negócio, prioriza o backlog, representa o "cliente" na entrega | Pode também codar, mas foco em requisitos e apresentação |
| 2 | **Scrum Master** | Organiza reuniões (daily, planning, review, retro), remove impedimentos do time | Geralmente também é dev, acumula função |
| 3-4 | **Desenvolvedores Frontend/Mobile** | Constroem a interface no React Native | Telas, navegação, consumo da API |
| 5 | **Desenvolvedor Backend** | Constrói a API que o app vai consumir (Node, Django, Spring, etc. — o que o grupo escolher) | Banco de dados, regras de negócio, autenticação |
| 6 | **DevOps / Infraestrutura** | Cuida do Git (branches, pull requests), do Docker (containers de dev e build) e, se der tempo, de um pipeline simples de CI/CD | Docker Compose, GitHub Actions ou similar |
| 7 | **UI/UX Designer** | Cria o design (wireframes, protótipo no Figma) e garante identidade visual | Pode ajudar no frontend também |

Como são só 7 pessoas para 7 frentes, o normal é cada um assumir um papel "dono" e ajudar em pelo menos uma outra frente. Ninguém fica 100% isolado na própria função.

### 2. Como aplicar o desenvolvimento ágil (Scrum simplificado)

- **Sprints curtas**: divida o projeto em ciclos de 1 a 2 semanas, com entregas parciais (ex: sprint 1 = protótipo de design + estrutura do banco; sprint 2 = telas principais + API básica).
- **Daily rápida**: 5 a 10 minutos, cada um fala o que fez, o que vai fazer, e se tem algum bloqueio. Pode ser até por mensagem no grupo.
- **Backlog no Trello, Notion ou GitHub Projects**: lista de tarefas priorizadas pelo PO.
- **Sprint Review**: no fim de cada ciclo, mostrar o que foi feito (mesmo que incompleto).
- **Retrospectiva**: 15 minutos para discutir o que funcionou e o que precisa melhorar no processo do time.

### 3. Como aplicar DevOps na prática

- **Git**: adotar um fluxo simples, como o **Git Flow** reduzido — branch `main` (estável), branch `dev` (integração) e branches de feature (`feature/tela-login`, por exemplo). Toda mudança entra por Pull Request, revisado por pelo menos 1 colega.
- **Docker**: usar containers para padronizar o ambiente de desenvolvimento (evita o clássico "na minha máquina funciona"). Pode ter um `docker-compose.yml` rodando backend + banco de dados juntos.
- **CI/CD (opcional, mas soma pontos)**: um pipeline simples no GitHub Actions que roda testes ou builda o projeto automaticamente a cada push. Não precisa ser complexo — já mostra domínio do conceito de DevOps.

### 4. Resumo da distribuição sugerida para 7 pessoas

1. **1 Product Owner / Líder do projeto**
2. **1 Scrum Master** (pode acumular com desenvolvimento)
3. **2 Desenvolvedores Mobile (React Native)**
4. **1 Desenvolvedor Backend**
5. **1 DevOps (Git + Docker + CI/CD)**
6. **1 UI/UX Designer**

Essa divisão cobre as três frentes que todo projeto de software precisa: **produto** (o que construir), **desenvolvimento** (como construir) e **operação/infraestrutura** (como manter funcionando). Para a disciplina de Empreendedorismo, vale destacar essa organização na apresentação, já que mostra domínio de metodologias reais do mercado de tecnologia, não só a parte de código.
