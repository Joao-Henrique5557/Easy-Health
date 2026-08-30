# Easy Health — App (React Native / Expo)

Frontend mobile do Easy Health, incluindo o **Assistente de IA** (navegação guiada + suporte 24h em emergências).

## Stack

- **Expo (React Native) + TypeScript**
- **React Navigation** (stack + bottom tabs)
- **axios** com interceptors de auth (access/refresh token)
- **expo-secure-store** — tokens no Android Keystore / iOS Keychain (nunca em `AsyncStorage` puro)
- **expo-location** — GPS para busca de atendimento e Modo Emergência
- **expo-notifications** — push notifications (canal Android)
- **Linking** (React Native core) — abre o discador (`tel:`) e o app de mapas do sistema

## Como rodar

Primeiro suba o backend (veja `../backend/README.md` — resumindo, é
`docker compose up --build` na raiz do projeto). Depois:

```bash
npm install
npx expo start
```

Escaneie o QR code com o app **Expo Go** no Android, ou pressione `a` para abrir num emulador Android.

## Configuração da API

A URL do backend fica em `app.json` → `expo.extra.apiUrl`. **O endereço certo depende de onde o
app está rodando** — isso é a causa mais comum de "não conecta com o backend":

| Onde o app roda | Use |
| --- | --- |
| Navegador (Expo web) ou simulador iOS | `http://localhost:3333` |
| Emulador Android | `http://10.0.2.2:3333` (o emulador não enxerga "localhost" do seu PC) |
| Celular físico (Expo Go ou APK) | `http://SEU_IP_LOCAL:3333`, ex: `http://192.168.0.10:3333` — descubra com `ipconfig` (Windows) ou `ifconfig`/`ip a` (Mac/Linux). O celular precisa estar na mesma rede Wi-Fi. |

Isso vale rodando o backend via Docker ou direto com `npm run dev` — o Docker só isola o
processo, não muda qual IP o celular usa para alcançá-lo. Detalhes e comentários adicionais em
`src/config/env.ts`.

## Arquitetura de pastas

```
src/
  theme/           cores e tipografia (mesma identidade do design)
  navigation/      RootNavigator (auth) + MainTabsNavigator (abas)
  screens/         uma tela por arquivo
  components/      Tile, Pill, ClinicCard, AssistantFab, AssistantPanel, Buttons, ScreenHeader...
  services/        um arquivo por grupo de rotas do backend (api, authService, ...)
  hooks/           useLocation (GPS)
  data/            conteúdo local (primeiros socorros, mocks) usado como fallback offline
  config/          env.ts (URL da API, números de emergência)
```

## Backend

O backend já está implementado em `../backend` (Node.js/TypeScript + Express + Prisma +
PostgreSQL), cobrindo todas as rotas da seção 21 do readme do projeto, mais a rota do
Assistente de IA:

```
POST /api/assistant/message
body: { message: string, history: { role: "user"|"assistant", content: string }[] }
resposta: { reply: string, screen: "home"|"primeiros_socorros"|"busca_atendimento"|"historico"|"perfil"|"emergencia"|null }
```

Ela chama a API da Claude **do lado do servidor** (a chave de API nunca fica no app — ver
`src/services/assistantService.ts` para o motivo, e `backend/src/modules/assistant` para a
implementação e o prompt de sistema).

Todo service em `src/services/*.ts` tem fallback automático para dados locais (mock) quando a
chamada à API falha — então o app continua navegável mesmo com o backend fora do ar, mas o
comportamento esperado normal é conversar com o backend real.

## Regras de segurança do Modo Emergência (não alterar)

1. O app **nunca** faz uma ligação sozinho. `emergencyService.callNumber()` só abre o discador
   nativo via `Linking.openURL("tel:...")` — quem confirma a ligação é o sistema operacional,
   com o toque do usuário.
2. A detecção de emergência no assistente de IA roda **localmente**, por palavras-chave
   (`src/data/emergencyKeywords.ts`), antes de qualquer chamada de rede. Isso garante que o
   usuário chegue à tela de emergência mesmo sem internet ou se o backend/IA estiver fora do ar.
3. O conteúdo de primeiros socorros tem uma cópia local (`src/data/firstAidContent.ts`) usada como
   fallback automático se a API estiver indisponível.
4. Nenhum texto do assistente de IA deve sugerir diagnóstico, dosagem de medicamento, ou que o
   app "vai ligar" por conta própria — isso é reforçado no prompt de sistema do backend.

## Próximos passos sugeridos

- [ ] Configurar EAS Build (`eas.json`) para gerar o `.apk`/`.aab` de teste.
- [ ] Ícones e splash screen reais em `assets/`.
- [ ] Testes automatizados das telas críticas (Emergência, Assistente).
- [ ] Login social (Google/Apple) — hoje é só visual, precisa de configuração OAuth real.
- [ ] Upload de foto de perfil, download de receita em PDF, adicionar consulta ao calendário do
      sistema — cada um depende de uma API nativa (`expo-image-picker`, `expo-calendar`) ou rota
      de backend ainda não implementada (ver `backend/README.md`).
