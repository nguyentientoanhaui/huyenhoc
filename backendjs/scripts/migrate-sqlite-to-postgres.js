/**
 * SQLite to PostgreSQL Migration Script
 * Converts data from SQLite database to PostgreSQL (Supabase)
 * 
 * Usage: node scripts/migrate-sqlite-to-postgres.js
 * 
 * Environment Variables:
 * - SQLITE_PATH: Path to SQLite database file (default: data/bazi_consultant.db)
 * - DATABASE_URL: PostgreSQL connection string (required)
 */

require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const SQLITE_PATH = process.env.SQLITE_PATH || path.join(__dirname, '../data/bazi_consultant.db');
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is required');
    process.exit(1);
}

// SQLite connection
let sqliteDb = null;

// PostgreSQL connection pool
const pgPool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Utility functions
const log = (message) => console.log(`[MIGRATION] ${new Date().toISOString()} ${message}`);
const error = (message) => console.error(`[ERROR] ${new Date().toISOString()} ${message}`);

// Connect to SQLite
const connectSQLite = () => {
    return new Promise((resolve, reject) => {
        sqliteDb = new sqlite3.Database(SQLITE_PATH, (err) => {
            if (err) {
                reject(err);
            } else {
                log(`Connected to SQLite: ${SQLITE_PATH}`);
                resolve();
            }
        });
    });
};

// Get all rows from SQLite table
const getSQLiteRows = (tableName) => {
    return new Promise((resolve, reject) => {
        sqliteDb.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};

// Insert rows into PostgreSQL
const insertPostgresRows = async (tableName, rows) => {
    if (rows.length === 0) {
        log(`No rows to insert for table: ${tableName}`);
        return 0;
    }

    const client = await pgPool.connect();
    try {
        // Get column names from first row
        const columns = Object.keys(rows[0]);
        const columnList = columns.join(', ');
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

        let insertedCount = 0;

        for (const row of rows) {
            const values = columns.map(col => row[col]);
            const query = `INSERT INTO ${tableName} (${columnList}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;

            try {
                await client.query(query, values);
                insertedCount++;
            } catch (err) {
                // Log but continue with next row
                console.warn(`Warning: Failed to insert row in ${tableName}:`, err.message);
            }
        }

        log(`Inserted ${insertedCount}/${rows.length} rows into ${tableName}`);
        return insertedCount;
    } finally {
        client.release();
    }
};

// Get row count from table
const getRowCount = async (tableName, db = 'postgres') => {
    if (db === 'sqlite') {
        return new Promise((resolve, reject) => {
            sqliteDb.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
            });
        });
    } else {
        const result = await pgPool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        return parseInt(result.rows[0].count);
    }
};

// Create PostgreSQL schema
const createPostgresSchema = async () => {
    const client = await pgPool.connect();
    try {
        log('Creating PostgreSQL schema...');

        // Users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                credits INTEGER DEFAULT 0,
                is_admin INTEGER DEFAULT 0,
                bazi_data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Customers table
        await client.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id SERIAL PRIMARY KEY,
                name TEXT,
                year INTEGER NOT NULL,
                month INTEGER NOT NULL,
                day INTEGER NOT NULL,
                hour INTEGER DEFAULT 12,
                minute INTEGER DEFAULT 0,
                gender TEXT DEFAULT 'Nam',
                calendar TEXT DEFAULT 'solar',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Consultations table
        await client.query(`
            CREATE TABLE IF NOT EXISTS consultations (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER REFERENCES customers(id),
                theme_id TEXT,
                question_id TEXT NOT NULL,
                question_text TEXT,
                answer TEXT,
                use_ai INTEGER DEFAULT 1,
                credits_used INTEGER DEFAULT 0,
                user_id INTEGER REFERENCES users(id),
                persona TEXT DEFAULT 'huyen_co',
                follow_ups TEXT,
                person1_data TEXT,
                person2_data TEXT,
                metadata TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Question categories table
        await client.query(`
            CREATE TABLE IF NOT EXISTS question_categories (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                icon TEXT DEFAULT '📋',
                order_index INTEGER DEFAULT 0,
                is_active INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Custom questions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS custom_questions (
                id SERIAL PRIMARY KEY,
                category_id INTEGER REFERENCES question_categories(id),
                text TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Sessions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                user_data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP
            )
        `);

        // Credit transactions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS credit_transactions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                amount INTEGER NOT NULL,
                type TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Credit requests table
        await client.query(`
            CREATE TABLE IF NOT EXISTS credit_requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                amount INTEGER DEFAULT 100,
                status TEXT DEFAULT 'pending',
                admin_note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                processed_at TIMESTAMP,
                processed_by INTEGER
            )
        `);

        // Article categories table
        await client.query(`
            CREATE TABLE IF NOT EXISTS article_categories (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                description TEXT,
                order_index INTEGER DEFAULT 0,
                is_active INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Articles table
        await client.query(`
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                excerpt TEXT,
                content TEXT NOT NULL,
                thumbnail TEXT,
                category_id INTEGER REFERENCES article_categories(id),
                author TEXT DEFAULT 'Huyền Cơ Bát Tự',
                views INTEGER DEFAULT 0,
                is_published INTEGER DEFAULT 1,
                is_featured INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Que history table
        await client.query(`
            CREATE TABLE IF NOT EXISTS que_history (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                customer_id INTEGER REFERENCES customers(id),
                context_id TEXT,
                bazi_params TEXT,
                que_type TEXT NOT NULL,
                period_key TEXT NOT NULL,
                gua_number INTEGER,
                gua_name TEXT,
                gua_data TEXT,
                user_note TEXT,
                is_verified INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Access logs table
        await client.query(`
            CREATE TABLE IF NOT EXISTS access_logs (
                id SERIAL PRIMARY KEY,
                ip TEXT,
                method TEXT,
                path TEXT,
                status_code INTEGER,
                user_agent TEXT,
                user_id INTEGER REFERENCES users(id),
                user_email TEXT,
                response_time INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        log('PostgreSQL schema created successfully');
    } finally {
        client.release();
    }
};

// Create indexes
const createIndexes = async () => {
    const client = await pgPool.connect();
    try {
        log('Creating indexes...');

        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
            'CREATE INDEX IF NOT EXISTS idx_consultations_customer ON consultations(customer_id)',
            'CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_customers_birth ON customers(year, month, day)',
            'CREATE INDEX IF NOT EXISTS idx_questions_category ON custom_questions(category_id)',
            'CREATE INDEX IF NOT EXISTS idx_credit_trans_user ON credit_transactions(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_credit_requests_status ON credit_requests(status)',
            'CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)',
            'CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)',
            'CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id)',
            'CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published)',
            'CREATE INDEX IF NOT EXISTS idx_access_logs_created ON access_logs(created_at)',
            'CREATE INDEX IF NOT EXISTS idx_access_logs_ip ON access_logs(ip)',
            'CREATE INDEX IF NOT EXISTS idx_access_logs_path ON access_logs(path)'
        ];

        for (const indexQuery of indexes) {
            await client.query(indexQuery);
        }

        log('Indexes created successfully');
    } finally {
        client.release();
    }
};

// Main migration function
const migrate = async () => {
    try {
        log('Starting SQLite to PostgreSQL migration...');

        // Connect to databases
        await connectSQLite();
        log('Connected to PostgreSQL');

        // Create schema
        await createPostgresSchema();

        // Create indexes
        await createIndexes();

        // Tables to migrate (in order of dependencies)
        const tables = [
            'users',
            'customers',
            'question_categories',
            'custom_questions',
            'consultations',
            'sessions',
            'credit_transactions',
            'credit_requests',
            'article_categories',
            'articles',
            'que_history',
            'access_logs'
        ];

        let totalInserted = 0;

        for (const table of tables) {
            try {
                log(`Migrating table: ${table}`);
                const rows = await getSQLiteRows(table);
                const inserted = await insertPostgresRows(table, rows);
                totalInserted += inserted;
            } catch (err) {
                error(`Failed to migrate table ${table}: ${err.message}`);
                // Continue with next table
            }
        }

        // Verify migration
        log('Verifying migration...');
        for (const table of tables) {
            try {
                const sqliteCount = await getRowCount(table, 'sqlite');
                const postgresCount = await getRowCount(table, 'postgres');
                const status = sqliteCount === postgresCount ? '✓' : '✗';
                log(`${status} ${table}: SQLite=${sqliteCount}, PostgreSQL=${postgresCount}`);
            } catch (err) {
                error(`Failed to verify table ${table}: ${err.message}`);
            }
        }

        log(`Migration completed! Total rows inserted: ${totalInserted}`);
        log('Please verify the data in PostgreSQL before switching to production');

    } catch (err) {
        error(`Migration failed: ${err.message}`);
        process.exit(1);
    } finally {
        // Close connections
        if (sqliteDb) {
            sqliteDb.close();
        }
        await pgPool.end();
    }
};

// Run migration
migrate();
