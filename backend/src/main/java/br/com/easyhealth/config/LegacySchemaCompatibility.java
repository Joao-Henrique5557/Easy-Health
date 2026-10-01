package br.com.easyhealth.config;

import javax.sql.DataSource;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

@Component
public class LegacySchemaCompatibility implements ApplicationRunner {
    private static final String SYNC_FUNCTION = """
            CREATE OR REPLACE FUNCTION easy_health_sync_legacy_columns() RETURNS trigger
            LANGUAGE plpgsql AS $$
            DECLARE
                row_data jsonb := to_jsonb(NEW);
                legacy_data jsonb := '{}'::jsonb;
            BEGIN
                IF TG_TABLE_NAME = 'users' THEN
                    IF row_data ? 'senhaHash' THEN legacy_data := legacy_data || jsonb_build_object('senhaHash', row_data->'senha_hash'); END IF;
                    IF row_data ? 'dataNascimento' THEN legacy_data := legacy_data || jsonb_build_object('dataNascimento', row_data->'data_nascimento'); END IF;
                    IF row_data ? 'avatarUrl' THEN legacy_data := legacy_data || jsonb_build_object('avatarUrl', row_data->'avatar_url'); END IF;
                    IF row_data ? 'tipoSanguineo' THEN legacy_data := legacy_data || jsonb_build_object('tipoSanguineo', row_data->'tipo_sanguineo'); END IF;
                    IF row_data ? 'medicamentosEmUso' THEN legacy_data := legacy_data || jsonb_build_object('medicamentosEmUso', row_data->'medicamentos_em_uso'); END IF;
                    IF row_data ? 'planoDeSaude' THEN legacy_data := legacy_data || jsonb_build_object('planoDeSaude', row_data->'plano_de_saude'); END IF;
                    IF row_data ? 'contatoEmergenciaNome' THEN legacy_data := legacy_data || jsonb_build_object('contatoEmergenciaNome', row_data->'contato_emergencia_nome'); END IF;
                    IF row_data ? 'contatoEmergenciaTelefone' THEN legacy_data := legacy_data || jsonb_build_object('contatoEmergenciaTelefone', row_data->'contato_emergencia_telefone'); END IF;
                    IF row_data ? 'contatoEmergenciaParentesco' THEN legacy_data := legacy_data || jsonb_build_object('contatoEmergenciaParentesco', row_data->'contato_emergencia_parentesco'); END IF;
                    IF row_data ? 'emailVerificado' THEN legacy_data := legacy_data || jsonb_build_object('emailVerificado', row_data->'email_verificado'); END IF;
                    IF row_data ? 'createdAt' THEN legacy_data := legacy_data || jsonb_build_object('createdAt', COALESCE(row_data->'created_at', to_jsonb(now()))); END IF;
                    IF row_data ? 'updatedAt' THEN legacy_data := legacy_data || jsonb_build_object('updatedAt', to_jsonb(now())); END IF;
                ELSIF TG_TABLE_NAME = 'favorites' THEN
                    IF row_data ? 'userId' THEN legacy_data := legacy_data || jsonb_build_object('userId', row_data->'user_id'); END IF;
                    IF row_data ? 'establishmentId' THEN legacy_data := legacy_data || jsonb_build_object('establishmentId', row_data->'establishment_id'); END IF;
                    IF row_data ? 'createdAt' THEN legacy_data := legacy_data || jsonb_build_object('createdAt', COALESCE(row_data->'created_at', to_jsonb(now()))); END IF;
                    IF row_data ? 'id' AND row_data->'id' = 'null'::jsonb THEN
                        legacy_data := legacy_data || jsonb_build_object('id', gen_random_uuid()::text);
                    END IF;
                ELSIF TG_TABLE_NAME = 'notifications' THEN
                    IF row_data ? 'userId' THEN legacy_data := legacy_data || jsonb_build_object('userId', row_data->'user_id'); END IF;
                    IF row_data ? 'createdAt' THEN legacy_data := legacy_data || jsonb_build_object('createdAt', COALESCE(row_data->'created_at', to_jsonb(now()))); END IF;
                    IF row_data ? 'icon' AND row_data->'icon' = 'null'::jsonb THEN
                        legacy_data := legacy_data || jsonb_build_object('icon', 'notifications');
                    END IF;
                END IF;
                NEW := jsonb_populate_record(NEW, legacy_data);
                RETURN NEW;
            END
            $$;
            """;

    private final JdbcTemplate jdbc;
    private final DataSource dataSource;

    public LegacySchemaCompatibility(JdbcTemplate jdbc, DataSource dataSource) {
        this.jdbc = jdbc;
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) {
        jdbc.execute(SYNC_FUNCTION);
        jdbc.execute("DROP TRIGGER IF EXISTS easy_health_sync_legacy_user_columns ON users");
        jdbc.execute("DROP TRIGGER IF EXISTS easy_health_sync_legacy_favorite_columns ON favorites");
        jdbc.execute("DROP TRIGGER IF EXISTS easy_health_sync_legacy_notification_columns ON notifications");
        jdbc.execute("""
                CREATE TRIGGER easy_health_sync_legacy_user_columns
                BEFORE INSERT OR UPDATE ON users
                FOR EACH ROW EXECUTE FUNCTION easy_health_sync_legacy_columns()
                """);
        jdbc.execute("""
                CREATE TRIGGER easy_health_sync_legacy_favorite_columns
                BEFORE INSERT OR UPDATE ON favorites
                FOR EACH ROW EXECUTE FUNCTION easy_health_sync_legacy_columns()
                """);
        jdbc.execute("""
                CREATE TRIGGER easy_health_sync_legacy_notification_columns
                BEFORE INSERT OR UPDATE ON notifications
                FOR EACH ROW EXECUTE FUNCTION easy_health_sync_legacy_columns()
                """);
        new ResourceDatabasePopulator(new ClassPathResource("seed.sql")).execute(dataSource);
    }
}
