package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/** Centraliza a conexão JDBC para que todos os DAOs usem a mesma configuração. */
public final class Database {
   private Database() {
   }

   public static Connection open() throws SQLException {
       try {
           // O Tomcat pode usar um classloader diferente do Maven.
           // O registro explícito evita "No suitable driver" no container.
           Class.forName("org.postgresql.Driver");
       } catch (ClassNotFoundException e) {
           throw new SQLException("Driver JDBC do PostgreSQL não encontrado", e);
       }

       return DriverManager.getConnection(
               env("DB_URL", "jdbc:postgresql://localhost:5432/easyhealth"),
               env("DB_USER", "easyhealth"),
               env("DB_PASSWORD", "easyhealth")
       );
   }

   public static boolean available() {
       try (Connection connection = open()) {
           return connection.isValid(2);
       } catch (Exception e) {
           return false;
       }
   }

   public static String env(String key, String fallback) {
       String value = System.getenv(key);
       return value == null || value.isBlank() ? fallback : value;
   }
}
