-- Create separate databases per server (Scania, Bera)
-- Runs on first postgres startup. For existing setups: psql -U postgres -c "CREATE DATABASE roc_scania; CREATE DATABASE roc_bera;"
SELECT 'CREATE DATABASE roc_scania' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'roc_scania')\gexec
SELECT 'CREATE DATABASE roc_bera' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'roc_bera')\gexec
