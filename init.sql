DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}') THEN
            PERFORM pg_create_database('${DB_NAME}');
        END IF;
    END $$;
