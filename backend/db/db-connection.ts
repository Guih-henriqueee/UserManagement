import { Pool } from 'pg';

// Configuração padrão para conexão local ao PostgreSQL (container)
const localDbConfig = {
    user: 'root',
    host: 'localhost',
    database: 'datalake',
    password: 'Password!@#', 
    port: 5432,
    schema: 'staging',
};

// Alternativa para acessar via URL externa (ajuste {port} conforme necessário)
const externalDbConfig = {
    user: 'postgres',
    host: 'legendary-space-rotary-phone-7qgw5x6r9vx2xjx9.github.dev',
    database: 'postgres',
    password: 'postgres', // ajuste conforme necessário
    port: 5432, // substitua pelo {port} correto se diferente
    ssl: true,
};

// Escolha a configuração conforme o ambiente
const isExternal = process.env.DB_EXTERNAL === 'true';
const dbConfig = isExternal ? externalDbConfig : localDbConfig;

export const pool = new Pool(dbConfig);

// Exemplo de teste de conexão
export async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Conexão bem-sucedida!');
        client.release();
    } catch (err) {
        console.error('Erro na conexão:', err);
    }
}