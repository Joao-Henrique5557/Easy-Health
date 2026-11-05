# Easy Health — App (React Native / Expo)

Frontend mobile do Easy Health, incluindo o **Assistente de IA** (navegação guiada + suporte 24h em emergências).

## Stack

- **Expo (React Native) + JavaScript**
- **React Navigation** (stack + bottom tabs)
- **axios** com interceptors de auth (access/refresh token)
- **expo-secure-store** — tokens no Android Keystore / iOS Keychain (nunca em `AsyncStorage` puro)
- **expo-location** — GPS para busca de atendimento e Modo Emergência
- **expo-notifications** — push notifications (canal Android)
- **expo-calendar**, **expo-image-picker**, **expo-print** e **expo-sharing** — calendário,
  foto do perfil e resumo de consulta em PDF
- **expo-auth-session** — login com Google, com verificação do token no backend
- **Linking** (React Native core) — abre o discador (`tel:`) e o app de mapas do sistema

## Como rodar

Para iniciar a stack completa, execute na raiz do projeto:

```bash
docker compose up --build
```

A versão web fica em `http://localhost:8081`. Para iniciar apenas o frontend e os serviços
de que ele depende:

```bash
docker compose up --build frontend
```

Para executar o aplicativo localmente com Expo Go:

```bash
npm install
npx expo start
```

Escaneie o QR code com o app **Expo Go** no Android, ou pressione `a` para abrir num emulador Android.

Alertas do app também aparecem como mensagens textuais dentro da interface web e mobile.
No Android, a caixa de diálogo nativa continua disponível; confirmações com ações podem ser
concluídas pelo alerta textual.

## Configuração da API

A URL do backend vem de `EXPO_PUBLIC_API_URL`; sem ela, o app usa
`app.json` → `expo.extra.apiUrl`. **O endereço certo depende de onde o app está rodando** —
isso é a causa mais comum de "não conecta com o backend":

| Onde o app roda | Use |
| --- | --- |
| Navegador (Expo web) ou simulador iOS | `http://localhost:3333` |
| Emulador Android | `http://10.0.2.2:3333` (o emulador não enxerga "localhost" do seu PC) |
| Celular físico (Expo Go ou APK) | `http://SEU_IP_LOCAL:3333`, ex: `http://192.168.0.10:3333` — descubra com `ipconfig` (Windows) ou `ifconfig`/`ip a` (Mac/Linux). O celular precisa estar na mesma rede Wi-Fi. |

Para sobrescrever a URL sem alterar `app.json`, defina `EXPO_PUBLIC_API_URL` no ambiente
ou no `.env` da raiz. O Compose usa `http://localhost:3333` (ou a porta configurada para o
backend); em um celular físico, use o IP local da máquina.

Isso vale rodando o backend via Docker ou direto com `npm run dev` — o Docker só isola o
processo, não muda qual IP o celular usa para alcançá-lo. Detalhes e comentários adicionais em
`src/config/env.js`.

## Gerar APK Android

O perfil `preview` em [`eas.json`](./eas.json) gera um APK instalável usando o EAS Build,
na nuvem. É necessário ter uma conta Expo e acesso à internet; não é necessário instalar
o Android SDK localmente.

Na primeira execução, autentique-se e vincule o projeto a uma conta Expo:

```bash
npx eas-cli@latest login
npx eas-cli@latest init
```

Configure `EXPO_PUBLIC_API_URL` nas variáveis do projeto Expo para o ambiente **preview**.
O valor deve ser uma URL acessível pelo aparelho, como o IP local do computador na mesma
rede Wi-Fi ou o endereço público do backend. `localhost` e `10.0.2.2` não funcionam em
um celular físico.

Gere o APK com:

```bash
npx eas-cli@latest build --platform android --profile preview
```

Quando a compilação terminar, baixe o APK pelo link exibido no terminal ou no painel do
projeto Expo e instale-o no dispositivo Android.

## Login com Google

O botão Google está disponível nas telas de login e cadastro. O login só é habilitado depois
de configurar OAuth no [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. Crie um OAuth Client ID do tipo **Web application** e outro do tipo **Android**; crie
   também um de **iOS** se essa plataforma for usada.
2. No cliente Android, use o pacote `br.com.easyhealth.app` e o SHA-1 do certificado que
   assina o APK (consulte `npx eas-cli@latest credentials --platform android`).
3. Configure `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`,
   `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` e, se necessário,
   `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` no ambiente em que o frontend será compilado/iniciado.
4. Configure `GOOGLE_OAUTH_CLIENT_IDS` no backend com os mesmos Client IDs separados por
   vírgula. Exemplo: `id-web.apps.googleusercontent.com,id-android.apps.googleusercontent.com`.
5. Reinicie/reconstrua o frontend e o backend para aplicar a configuração.

Os Client IDs são identificadores públicos do OAuth; não coloque **Client Secrets** no app
nem no arquivo `.env` do frontend. O backend valida o ID token com o Google, confere emissor,
validade, e-mail verificado e audiência configurada antes de criar a sessão. Sem esses IDs,
o botão informa que o login ainda precisa ser configurado.

## Histórico e documentos

O histórico permite incluir, editar e remover registros de exames, vacinas, medicamentos e
documentos da própria pessoa usuária. Os dados ficam associados à conta e persistidos no
MySQL. O PDF disponível na consulta é um **resumo informativo do agendamento**; não é receita,
atestado, laudo ou orientação médica.

Na confirmação do agendamento, o app adiciona um evento ao calendário do dispositivo. Na web,
baixa um arquivo `.ics` que pode ser importado pelo calendário. A foto de perfil pode ser
selecionada na galeria; imagens JPEG/PNG de até 2 MB são validadas, redimensionadas e
comprimidas pelo backend antes de persistir.

## Arquitetura de pastas

```
src/
  theme/           cores e tipografia (mesma identidade do design)
  navigation/      RootNavigator (auth) + MainTabsNavigator (abas)
  screens/         uma tela por arquivo
  components/      Tile, Pill, ClinicCard, AssistantFab, AssistantPanel, Buttons, ScreenHeader...
  services/        um arquivo por grupo de rotas do backend (api, authService, ...)
  hooks/           useLocation (GPS)
  data/            conteúdo JSON local de primeiros socorros
  config/          env.js (URL da API, números de emergência)
```

## Backend

O backend em `../backend` usa **Spring Boot 3.5 + Java 25 + MySQL** e sobe como JAR
executável. Ele implementa as rotas usadas pelo aplicativo e persiste contas, sessões,
agendamentos, favoritos e notificações. Consulte `../backend/README.md` para executar e
entender os limites das integrações demonstrativas. A rota do assistente é:

```
POST /api/assistant/message
body: { message: string, history: { role: "user"|"assistant", content: string }[] }
resposta: { reply: string, screen: "home"|"primeiros_socorros"|"busca_atendimento"|"historico"|"perfil"|"emergencia"|null }
```

O assistente usa regras locais demonstrativas e não chama um provedor de IA. Uma
integração real deve permanecer no servidor; a chave nunca deve ficar no aplicativo.

Os guias de primeiros socorros vêm diretamente de `src/data/firstAidGuides.json` e funcionam
offline. Estabelecimentos e horários vêm da API do backend e do catálogo fictício de
`docs/SQL/02_instituicoes_medicas.sql` + `03_dados_exemplo_instituicoes.sql`; não há um segundo
catálogo local de estabelecimentos no app. Recursos associados à conta, como histórico e
perfil, dependem de uma resposta válida do backend e exibem erro quando não conseguem carregar
ou salvar os dados.

## Regras de segurança do Modo Emergência (não alterar)

1. O app **nunca** faz uma ligação sozinho. `emergencyService.callNumber()` só abre o discador
   nativo via `Linking.openURL("tel:...")` — quem confirma a ligação é o sistema operacional,
   com o toque do usuário.
2. A detecção de emergência no assistente de IA roda **localmente**, por palavras-chave
   (`src/data/emergencyKeywords.js`), antes de qualquer chamada de rede. Isso garante que o
   usuário chegue à tela de emergência mesmo sem internet ou se o backend/IA estiver fora do ar.
3. O conteúdo de primeiros socorros é carregado localmente de `src/data/firstAidGuides.json`,
   portanto continua disponível sem rede ou backend.
4. Nenhum texto do assistente de IA deve sugerir diagnóstico, dosagem de medicamento, ou que o
   app "vai ligar" por conta própria — isso é reforçado no prompt de sistema do backend.

## Próximos passos sugeridos

- [ ] Ícones e splash screen reais em `assets/`.
- [ ] Testes automatizados das telas críticas (Emergência, Assistente).
