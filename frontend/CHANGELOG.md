# Changelog — Auditoria e alinhamento ao design

Esta rodada teve dois objetivos: **corrigir bugs reais** do código anterior e
**alinhar 100% o front ao design (Figma)** fornecido pelo usuário. Ambos foram
validados de forma concreta, não só visualmente — ver seção "Como foi validado".

## Bugs corrigidos

1. **`babel-plugin-module-resolver` ausente do `package.json`.** O
   `babel.config.js` já referenciava esse plugin (necessário para os imports
   `@/...` usados em TODOS os arquivos do projeto) mas ele não estava
   declarado como dependência. Sem isso, o Metro bundler quebraria ao rodar
   o app de verdade — mesmo com o `tsc` passando limpo, porque o TypeScript
   resolve `@/...` via `tsconfig.paths` (só checagem de tipos) e o Metro
   resolve em runtime via esse plugin do Babel — são mecanismos
   independentes. Corrigido e reinstalado.
2. **Tipo de navegação por interseção.** A versão anterior usava
   `BottomTabNavigationProp<A> & NativeStackNavigationProp<B>`, que funciona
   por coincidência mas não é o padrão do React Navigation. Trocado por
   `CompositeNavigationProp` (`src/navigation/useAppNavigation.ts`).
3. **Tokens de tipografia obsoletos.** Ao trocar a fonte de Fraunces para
   Inter, alguns arquivos (`AssistantPanel.tsx`, `RootNavigator.tsx`,
   `MainTabsNavigator.tsx`) ainda referenciavam `fonts.body`, `fonts.bodyBold`
   etc., que não existiam mais no novo `typography.ts`. Corrigido.
4. **Tab bar com 5 abas.** O design usa 4 abas (Início/Buscar/Histórico/
   Perfil); "Primeiros Socorros" virou navegação a partir da Home, não uma
   aba fixa.

## Alinhamento ao design

- **Paleta de cores real**, extraída por amostragem de pixel das telas
  enviadas (não estimada visualmente): verde `#059669`, vermelho
  `#EF4444`, tema escuro da emergência `#1E0A0A`/`#2D1A1A`. A paleta
  anterior (`#146B63` etc.) era inventada.
- **Tipografia**: trocada de Fraunces (serifada) para Inter em todos os
  pesos — o design não usa nenhuma fonte serifada.
- **11 telas novas** que não existiam na primeira versão: Onboarding,
  Recuperar Senha, Detalhe do Estabelecimento, Agendamento, Confirmação de
  Agendamento, Detalhe da Consulta, Notificações, Favoritos, Editar Perfil
  (as outras 2 eram variações já cobertas).
- **Modo Emergência redesenhado do zero** com tema escuro (estava claro),
  incluindo a seção "Ficha Médica do Usuário" (tipo sanguíneo, idade,
  alergias, contato de emergência) que não existia antes.
- **Primeiros Socorros**: tinha 6 categorias, o design tem 8 (faltavam
  "Crises Respiratórias" e "Fraturas") — conteúdo adicionado.
- **Login/Cadastro**: adicionados campo de mostrar/ocultar senha, botões de
  login social (Google/Apple — visuais, sem OAuth real ainda), checkbox de
  termos, link "Esqueci minha senha".
- **Home**: reescrita com avatar + saudação, sino de notificações, banner
  de emergência compacto, busca, grade de "Serviços Integrados" e seção
  "Próximas Consultas" — nada disso existia na versão anterior.
- Dados de demonstração (`src/data/*Mock.ts`) com os mesmos nomes/valores
  do design (Hospital São Lucas, Dr. Carlos Mendes etc.), usados como
  fallback automático sempre que uma chamada à API falha — o app fica
  navegável e visualmente fiel ao protótipo mesmo sem o backend pronto.

## Como foi validado (não só "parece certo")

1. `npx tsc --noEmit` — **0 erros** nos 30+ arquivos TypeScript do projeto.
   Validado que o checker realmente pega erro (injetei um erro de tipo de
   teste, confirmei que ele apareceu, revertido).
2. `npm install` completo, do zero, sem conflitos de versão.
3. `npx expo export --platform android` — **Metro bundler compilou com
   sucesso 1.006 módulos**, ou seja, toda a árvore real de imports (todas
   as telas, componentes, services, os aliases `@/...`, todo o JSX)
   resolve e empacota exatamente como aconteceria rodando num celular
   Android de verdade. Essa é a validação mais forte possível sem um
   dispositivo/emulador físico neste ambiente.
4. `npx expo-doctor` — 14/17 checks passam; as 3 falhas restantes são de
   checagem de versão via API do Expo, bloqueada pela rede restrita deste
   ambiente de sandbox (não são bugs do código).

## O que ainda não está implementado (intencional, fora do escopo do front)

- Login social (Google/Apple) é só visual — precisa de configuração OAuth.
- Upload de foto de perfil, adicionar registro manual ao histórico, baixar
  receita em PDF e adicionar ao calendário do sistema são placeholders com
  `Alert` — cada um depende de uma API nativa (`expo-image-picker`,
  `expo-calendar`) ou rota de backend ainda não implementada.
- Mapa real (react-native-maps) — a tela de busca usa um preview estático
  para não adicionar uma dependência nativa pesada num protótipo acadêmico;
  trocar por mapa real é direto quando fizer sentido.
