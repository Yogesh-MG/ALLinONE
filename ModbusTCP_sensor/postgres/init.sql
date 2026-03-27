-- Create user if not exists
DO $$ 
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'plc_user') THEN
      CREATE USER plc_user WITH PASSWORD 'your_password';
   END IF;
END $$;

-- Create database if not exists
DO $$ 
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'plcdata') THEN
      CREATE DATABASE plcdata;
   END IF;
END $$;

-- Grant privileges to plc_user
GRANT ALL PRIVILEGES ON DATABASE plcdata TO plc_user;

-- Connect to plcdata
\connect plcdata

-- Create table if not exists
CREATE TABLE IF NOT EXISTS plc_data (
    id SERIAL PRIMARY KEY,
    temperature REAL,
    oxygen_level REAL,
    alarm_status BOOLEAN,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant privileges on table and sequence
GRANT ALL PRIVILEGES ON TABLE plc_data TO plc_user;
DO $$ 
BEGIN
   IF EXISTS (SELECT FROM pg_class WHERE relname = 'plc_data_id_seq') THEN
      GRANT USAGE, SELECT ON SEQUENCE plc_data_id_seq TO plc_user;
   END IF;
END $$;