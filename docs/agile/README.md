# Gestão ágil do Easy Health

Este documento define como a equipe deve trabalhar usando Scrum de forma
proporcional ao tamanho do projeto. O objetivo não é criar burocracia, mas
manter uma fila única de trabalho, entregas verificáveis e aprendizado rápido.

## 1. Objetivo do produto

> Permitir que uma pessoa encontre informação confiável, organize seu
> histórico de saúde e acesse atendimento adequado com o menor atrito possível,
> inclusive em uma situação de emergência.

### Resultado esperado do MVP

O usuário consegue:

1. criar uma conta e acessar o aplicativo;
2. consultar orientações de primeiros socorros;
3. encontrar estabelecimentos de saúde e comparar informações;
4. visualizar e gerenciar agendamentos;
5. consultar histórico, favoritos e notificações;
6. acessar o Modo Emergência sem depender de login ou de uma chamada à IA.

O Easy Health não diagnostica, prescreve, substitui profissionais ou realiza
ligações automaticamente. Esses limites são requisitos do produto, não apenas
observações de implementação.

## 2. Papéis e responsabilidades

| Papel | Responsabilidades no processo |
| --- | --- |
| Product Owner (Cássio) | Maximizar valor, ordenar o Product Backlog, esclarecer regras e aceitar ou rejeitar incrementos. |
| Scrum Master (Caio) | Facilitar eventos, remover impedimentos, proteger o foco da Sprint e melhorar o processo. |
| Desenvolvimento (Alex, Maxuel, Isabela e João Henrique) | Planejar, construir, revisar, testar, documentar e integrar o incremento. |
| UI/UX (Adriel Vinicius) | Validar fluxos, acessibilidade, conteúdo visual e consistência da experiência. |

Os papéis não criam silos. Toda história deve ter um responsável principal e
pelo menos uma revisão de outra pessoa.

## 3. Fluxo de trabalho

O quadro deve ter as colunas:

```text
Backlog priorizado -> Pronta -> Em andamento -> Em revisão -> Em validação
                    -> Concluída
```

- **Pronta**: história que atende à Definition of Ready e pode entrar na
  Sprint.
- **Em andamento**: limitar a uma tarefa ativa por pessoa e, sempre que
  possível, no máximo duas histórias simultâneas.
- **Em revisão**: Pull Request aberto, com descrição, evidências e revisão
  técnica.
- **Em validação**: PO confere os critérios de aceitação no ambiente de teste.
- **Concluída**: atende à Definition of Done; não significa apenas “código
  escrito”.

Cada item deve estar ligado a uma issue ou card e a um Pull Request. O título
deve seguir `tipo/ID-descricao`, por exemplo:
`feature/EH-006-modo-emergencia`.

## 4. Cadência recomendada

Sprints de **duas semanas** são adequadas ao time e ao trabalho acadêmico.

| Evento | Quando | Duração | Saída obrigatória |
| --- | --- | --- | --- |
| Refinamento | Meio da Sprint | 45 min | Histórias esclarecidas, estimadas e próximas de “Pronta”. |
| Planning | Primeiro dia | 60 min | Objetivo da Sprint e Sprint Backlog comprometido. |
| Daily | Dias úteis | 10 min | Progresso, próximo passo e impedimentos; não é reunião de status para o PO. |
| Review | Último dia | 45 min | Incremento demonstrado e feedback registrado. |
| Retrospectiva | Após a Review | 30 min | Até três ações de melhoria, cada uma com responsável e prazo. |

O **Objetivo da Sprint** deve ser uma frase observável, por exemplo:
“reduzir o tempo para encontrar atendimento próximo e validar o fluxo de
emergência”.

## 5. Definition of Ready (DoR)

Uma história só entra em uma Sprint quando:

- tem usuário, necessidade e benefício explícitos;
- está pequena o suficiente para caber na Sprint;
- possui critérios de aceitação testáveis;
- regras, dependências, conteúdo clínico e integrações conhecidas estão
  identificados;
- o PO e o time entendem o resultado esperado;
- há uma estimativa em pontos e nenhuma dependência bloqueadora desconhecida.

## 6. Definition of Done (DoD)

Uma história só é concluída quando:

- implementação e tratamento de erro estão integrados;
- critérios de aceitação foram verificados no fluxo real;
- revisão de código foi aprovada;
- testes relevantes, lint e TypeScript/build passam;
- estados de carregamento, vazio, erro e offline foram considerados quando
  aplicável;
- dados pessoais e de saúde não aparecem em logs ou exemplos inseguros;
- documentação e contrato da API foram atualizados quando necessário;
- o PO validou o comportamento no ambiente de demonstração.

Para conteúdo de primeiros socorros ou emergência, a DoD também exige revisão
por pessoa qualificada antes de publicar. Sem essa validação, o item permanece
bloqueado, mesmo que a interface esteja pronta.

## 7. Priorização e estimativa

O PO ordena o backlog usando, nesta ordem:

1. segurança e risco clínico;
2. valor para o fluxo principal do usuário;
3. dependências técnicas;
4. aprendizado e redução de incerteza;
5. esforço.

Usar **Planning Poker** com a escala Fibonacci `1, 2, 3, 5, 8, 13`. Histórias
acima de 8 devem ser divididas antes da Sprint. Os pontos representam esforço,
complexidade e risco combinados; não são horas.

Métricas mínimas por Sprint:

- histórias concluídas / histórias comprometidas;
- lead time de “Em andamento” até “Concluída”;
- defeitos encontrados após a Review;
- impedimentos abertos e resolvidos;
- velocidade apenas como referência, nunca como meta individual.

## 8. Regras de qualidade e segurança

- Emergência deve funcionar com o mínimo necessário offline e nunca ligar
  automaticamente.
- A IA deve orientar e encaminhar; não diagnosticar, prescrever ou atrasar
  contato com socorro.
- Toda mudança que trata dados pessoais deve explicitar coleta, finalidade,
  acesso e exclusão.
- Pull Requests pequenos, com uma preocupação principal, são preferíveis a
  alterações grandes no fim da Sprint.

O backlog detalhado e os modelos de trabalho estão em
[`backlog.md`](./backlog.md) e [`templates.md`](./templates.md).
