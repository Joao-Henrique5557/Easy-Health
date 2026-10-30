package br.com.easyhealth.config;

import javax.sql.DataSource;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.lang.NonNull;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements ApplicationRunner {
    private final @NonNull DataSource dataSource;

    public DatabaseInitializer(@NonNull DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(@NonNull ApplicationArguments args) {
        new ResourceDatabasePopulator(new ClassPathResource("seed.sql")).execute(dataSource);
    }
}
