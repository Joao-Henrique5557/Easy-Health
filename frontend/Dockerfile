# Node.js é usado para instalar as dependências e executar o Expo para web.
FROM node:22-alpine

WORKDIR /app

# Instalar pelas versões travadas no package-lock.json torna o build reproduzível.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# O Expo serve a versão web neste endereço dentro do container.
EXPOSE 8081

# Desativa a telemetria enviada pelo Expo.
ENV EXPO_NO_TELEMETRY=1

CMD ["npx", "expo", "start", "--web", "--host", "lan", "--port", "8081"]
