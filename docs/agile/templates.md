# Modelos de trabalho

Copie os modelos abaixo para issues, cards ou Pull Requests. O objetivo é
tornar o resultado verificável por qualquer integrante, sem depender de
memória ou de conversa privada.

## História de usuário

```markdown
## [EH-000] Título curto no formato de benefício

**Épico:** E0
**Prioridade:** P0 | P1 | P2
**Estimativa:** 1 | 2 | 3 | 5 | 8 | 13
**Responsável:** @pessoa

### História
Como [tipo de usuário],
quero [necessidade],
para [benefício].

### Contexto e regras
- ...

### Critérios de aceitação
- [ ] Dado [contexto], quando [ação], então [resultado observável].
- [ ] ...

### Dependências
- ...

### Evidências esperadas
- Screenshot, vídeo, log, teste ou link para ambiente:
```

Critérios devem descrever comportamento observável. “Implementar endpoint” é
tarefa técnica, não critério de aceitação.

## Tarefas técnicas

```markdown
## [EH-000-T1] Verbo + resultado

- [ ] Código
- [ ] Teste
- [ ] Tratamento de erro
- [ ] Documentação/contrato
- [ ] Evidência para a Review
```

Uma tarefa técnica deve existir para viabilizar uma história, nunca substituir
a história de valor do usuário.

## Pull Request

```markdown
## O que muda

Resolve: #000

## Como validar
1. ...
2. ...

## Critérios atendidos
- [ ] CA-1
- [ ] CA-2

## Riscos e decisões
- ...

## Evidências
- Testes: `comando`
- Imagens/vídeo:
```

## Ata de Review

```markdown
## Sprint N — Review — AAAA-MM-DD

### Objetivo da Sprint
...

### Incremento demonstrado
- História: EH-000 — Aceita | Ajustar

### Feedback e decisões do PO
- ...

### Ações para o backlog
- [ ] Nova história ou ajuste — responsável — prioridade
```

## Retrospectiva

```markdown
## Sprint N — Retrospectiva — AAAA-MM-DD

### Funcionou
- ...

### Não funcionou
- ...

### Experimentaremos na próxima Sprint
- [ ] Ação concreta — responsável — prazo

### Impedimentos que precisam de escalonamento
- ...
```

## Checklist de validação do MVP

Antes de apresentar uma versão, executar pelo menos:

- cadastro, login, refresh, logout e recuperação de senha;
- caminho de emergência com e sem internet/localização;
- busca com resultado, lista vazia, erro e permissão negada;
- agendamento, conflito, cancelamento e notificações;
- assistente com chave configurada, sem chave e com mensagem de emergência;
- `npx tsc --noEmit` em frontend e backend;
- revisão dos textos para não prometer diagnóstico ou ligação automática;
- confirmação de que tokens e dados de saúde não aparecem em logs, screenshots
  ou commits.
