# Configuração do Easy-Health para execução no Android com Development Build

## 1. Problema identificado

Durante a execução do Easy-Health pelo Expo Go, ocorreu um erro relacionado ao módulo:

```text
RNGoogleSignin could not be found.
```

O projeto utiliza a dependência:

```text
@react-native-google-signin/google-signin
```

Essa biblioteca realiza a autenticação com o Google e depende de um módulo nativo do Android.

O problema é que o Expo Go padrão não possui esse módulo nativo integrado. Por isso, mesmo que o código JavaScript estivesse correto e as dependências instaladas no projeto, o aplicativo não conseguia executar corretamente a funcionalidade de login com Google.

### Solução necessária

Substituir o Expo Go por um **Development Build próprio do Easy-Health**, contendo os módulos nativos utilizados pelo projeto.

Como o computador possui recursos de hardware limitados (8 GB de RAM e vídeo integrado), optamos por realizar a compilação na nuvem utilizando o EAS Build, evitando sobrecarregar o sistema com a compilação local do Android.

---

## 2. Como o problema foi resolvido

### Passo 1 — Identificação das dependências

Verificamos se a biblioteca de autenticação do Google estava instalada:

```bash
npm ls @react-native-google-signin/google-signin
```

Resultado:

```text
@react-native-google-signin/google-signin@17.0.0
```

Também verificamos o `package.json` e confirmamos que o projeto já possuía:

- `expo-dev-client`
- `@react-native-google-signin/google-signin`
- Expo SDK 58
- React Native 0.88.1

Portanto, não era necessário instalar essas dependências novamente.

### Passo 2 — Verificação do EAS Build

Verificamos a disponibilidade do EAS CLI:

```bash
cd frontend && npx eas-cli --version
```

Em seguida, analisamos o arquivo `eas.json`:

```bash
cd frontend && cat eas.json
```

Identificamos que já existia um perfil chamado `development`, configurado para gerar um APK:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "environment": "preview",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

Essa configuração permite gerar um aplicativo de desenvolvimento com os módulos nativos necessários.

### Passo 3 — Compilação na nuvem

A compilação foi planejada para acontecer nos servidores do Expo, utilizando:

```bash
cd frontend && npx eas-cli build --platform android --profile development
```

Esse processo gera um APK de desenvolvimento sem exigir que o computador execute localmente a compilação do Gradle.

### Passo 4 — Instalação do APK no celular

Após obter o APK, utilizamos o ADB para instalar o aplicativo no Motorola conectado por USB:

```bash
adb install easy-health.apk
```

O terminal retornou:

```text
Performing Streamed Install
Success
```

Isso confirmou que o Android aceitou a instalação.

O pacote utilizado para abrir o aplicativo é:

```text
com.joaohenrique5557.easyhealth
```

### Passo 5 — Configuração da conexão USB

Para permitir que o celular acesse os serviços executados no computador por meio do cabo USB, utilizamos o encaminhamento de portas do ADB:

```bash
adb reverse tcp:8082 tcp:8082
adb reverse tcp:3333 tcp:3333
```

- Porta 8082: comunicação com o Metro Bundler.
- Porta 3333: acesso ao backend, caso a URL da API esteja configurada para localhost.

### Passo 6 — Inicialização do Metro

Iniciamos o servidor de desenvolvimento utilizando:

```bash
npx expo start --dev-client --localhost --port 8083
```

Foi necessário utilizar a porta 8083 porque a porta 8081 já estava ocupada por outro processo.

O terminal apresentou:

```text
Using development build
```

Isso confirmou que o Expo estava preparado para utilizar o Development Build, em vez do Expo Go.

**Observação:** como a porta utilizada foi 8083, o encaminhamento USB também precisa corresponder a ela:

```bash
adb reverse tcp:8083 tcp:8083
```

### Passo 7 — Abertura do aplicativo

Para iniciar o Easy-Health pelo terminal, utilizamos:

```bash
adb shell monkey -p com.joaohenrique5557.easyhealth 1
```

O comando foi executado com sucesso e abriu o Development Build.

Entretanto, o aplicativo apresentou a tela **Development Servers**, indicando que ainda era necessário selecionar ou informar o endereço do servidor Metro.

O endereço esperado para a conexão local é:

```text
http://127.0.0.1:8083
```

---

## 3. Como será o fluxo de desenvolvimento daqui em diante

Depois de configurar e conectar o Development Build ao Metro, o procedimento habitual será:

**1.** Conectar o celular ao computador por USB.

**2.** Configurar o encaminhamento das portas:

```bash
adb reverse tcp:8083 tcp:8083
adb reverse tcp:3333 tcp:3333
```

**3.** Iniciar o Metro:

```bash
npx expo start --dev-client --localhost --port 8083
```

**4.** Abrir o Easy-Health:

```bash
adb shell monkey -p com.joaohenrique5557.easyhealth 1
```

Não será necessário gerar e instalar um novo APK a cada alteração de código JavaScript ou React Native.

Uma nova compilação será necessária quando houver mudanças que exijam atualizar o código ou as dependências nativas do aplicativo.

---

## 4. Conclusão

O problema inicial não estava relacionado à instalação das dependências JavaScript, mas à ausência de um módulo nativo no Expo Go.

A solução foi migrar a execução para um Development Build próprio do Easy-Health, utilizando o EAS Build como alternativa à compilação local, devido às limitações de hardware do computador.

O APK foi instalado no Motorola, o Metro foi iniciado em modo Development Build e o aplicativo chegou à tela Development Servers.

**Status final:** a instalação e a inicialização do Development Build foram realizadas. Ainda falta concluir a conexão entre o aplicativo e o Metro para confirmar a execução completa do Easy-Health.
