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

```bash
npm install
npx expo start
```

Escaneie o QR code com o app **Expo Go** no Android, ou pressione `a` para abrir num emulador Android.

## Configuração da API

A URL do backend fica em `app.json` → `expo.extra.apiUrl`. Para rodar contra o seu backend local,
troque por algo como `http://SEU_IP_LOCAL:3333` (não use `localhost` no celular físico — ele não
enxerga o localhost do seu computador).

## Arquitetura de pastas

```
src/
  theme/           cores e tipografia (mesma identidade do protótipo web)
  navigation/      RootNavigator (auth) + MainTabsNavigator (abas)
  screens/         uma tela por arquivo
  components/      Tile, Pill, ClinicCard, AssistantFab, AssistantPanel
  services/        um arquivo por grupo de rotas do backend (api, authService, ...)
  hooks/           useLocation (GPS)
  data/            conteúdo local de primeiros socorros + palavras-chave de emergência
  config/          env.ts (URL da API, números de emergência)
```

## Rotas de backend consumidas

Todas as rotas seguem o documento de rotas do projeto (seção 21 do readme do produto).
Uma rota nova foi adicionada para o assistente de IA e ainda precisa ser implementada no backend:

```
POST /api/assistant/message
body: { message: string, history: { role: "user"|"assistant", content: string }[] }
resposta: { reply: string, screen: "home"|"primeiros_socorros"|"busca_atendimento"|"historico"|"perfil"|"emergencia"|null }
```

Essa rota deve chamar a API da Claude **do lado do servidor** (a chave de API nunca deve estar no
app — ver `src/services/assistantService.ts` para o motivo). O prompt de sistema sugerido está
documentado nos comentários desse arquivo.

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

- [ ] Implementar `POST /api/assistant/message` no backend (Node.js/TypeScript, chamando a API
      da Claude com a chave protegida em variável de ambiente).
- [ ] Implementar as demais rotas REST do backend conforme a seção 21 do readme do produto.
- [ ] Configurar EAS Build (`eas.json`) para gerar o `.apk`/`.aab` de teste.
- [ ] Ícones e splash screen reais em `assets/`.
- [ ] Testes automatizados das telas críticas (Emergência, Assistente).
