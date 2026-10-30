# Etapa de build: compila a API usando Maven e Java 25.
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app

# Copiar o manifesto primeiro permite reaproveitar o cache de dependências.
COPY pom.xml .
RUN mvn -B dependency:go-offline

# O código-fonte é copiado depois, para não invalidar o cache acima a cada mudança.
COPY src ./src
RUN mvn -B -DskipTests package

# Etapa final: a imagem de execução contém somente o Java e o JAR da aplicação.
FROM eclipse-temurin:25-jre-alpine

# O healthcheck do Compose usa curl para consultar a rota de saúde da API.
RUN apk add --no-cache curl \
    && addgroup -S app \
    && adduser -S -G app app

WORKDIR /app
COPY --from=build --chown=app:app /app/target/easy-health.jar ./app.jar

USER app
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
