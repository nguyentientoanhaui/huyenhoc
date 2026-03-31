/**
 * Data Migration Validation Script
 * Verifies data integrity after SQLite to PostgreSQL migration
 * 
 * Usage: node scripts/validate-migration.js
 * 
 * Environment Variables:
 * - SQLITE_PATH: Path to SQLite database file (default: data/bazi_consultant.db)
 * - DATABASE_URL: PostgreSQL connection string (required)
 */

require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const crypto = require('crypto');
const path = require('path');

const SQLITE_PATH = process.env.SQLITE_PATH || path.join(__dirname, '../data/bazi_consultant.db');
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is required');
    process.exit(1);
}

let sqliteDb = null;
const pgPool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const log = (message) => console.log(`[VALIDATE] ${new Date().toISOString()} ${message}`);
const error = (message) => console.error(`[ERROR] ${new Date().toISOString()} ${message}`);
const warn = (message) => console.warn(`[WARN] ${new Date().toISOString()} ${message}`);

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

// Get row count
const getRowCount = async (tableName, db = 'postgres') => {
    if (db === 'sqlite') {
        return new Promise((resolve, reject) => {
            sqliteDb.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
            });
        });
    } else {
        try {
            const result = await pgPool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
            return parseInt(result.rows[0].count);
        } catch (err) {
            return -1; // Table doesn't exist
        }
    }
};

// Get all rows from table
const getRows = async (tableName, db = 'postgres') => {
    if (db === 'sqlite') {
        return new Promise((resolve, reject) => {
            sqliteDb.all(`SELECT * FROM ${tableName}`, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    } else {
        try {
            const result = await pgPool.query(`SELECT * FROM ${tableName}`);
            return result.rows;
        } catch (err) {
            return [];
        }
    }
};

// Calculate checksum for row
const calculateRowChecksum = (row) => {
    const hash = crypto.createHash('md5');
    hash.update(JSON.stringify(row));
    return hash.digest('hex');
};

// Validate table data
const validateTable = async (tableName) => {
    try {
        const sqliteCount = await getRowCount(tableName, 'sqlite');
        const postgresCount = await getRowCount(tableName, 'postgres');

        if (postgresCount === -1) {
            warn(`Table ${tableName} does not exist in PostgreSQL`);
            return { table: tableName, status: 'MISSING', sqliteCount, postgresCount: 0 };
        }

        if (sqliteCount !== postgresCount) {
            warn(`Row count mismatch for ${tableName}: SQLite=${sqliteCount}, PostgreSQL=${postgresCount}`);
            return { table: tableName, status: 'MISMATCH', sqliteCount, postgresCount };
        }

        // Sample data validation (check first 10 rows)
        if (sqliteCount > 0) {
            const sqliteRows = await getRows(tableName, 'sqlite');
            const postgresRows = await getRows(tableName, 'postgres');

            let checksumMatches = 0;
            const sampleSize = Math.min(10, sqliteCount);

            for (let i = 0; i < sampleSize; i++) {
                const sqliteRow = sqliteRows[i];
                const postgresRow = postgresRows[i];

                if (sqliteRow && postgresRow) {
                    const sqliteChecksum = calculateRowChecksum(sqliteRow);
                    const postgresChecksum = calculateRowChecksum(postgresRow);

                    if (sqliteChecksum === postgresChecksum) {
                        checksumMatches++;
                    }
                }
            }

            if (checksumMatches === sampleSize) {
                return { table: tableName, status: 'OK', sqliteCount, postgresCount, checksumMatches, sampleSize };
            } else {
                warn(`Data mismatch in ${tableName}: ${checksumMatches}/${sampleSize} rows match`);
                return { table: tableName, status: 'DATA_MISMATCH', sqliteCount, postgresCount, checksumMatches, sampleSize };
            }
        }

        return { table: tableName, status: 'OK', sqliteCount, postgresCount };
    } catch (err) {
        error(`Failed to validate table ${tableName}: ${err.message}`);
        return { table: tableName, status: 'ERROR', error: err.message };
    }
};

// Validate all tables
const validateMigration = async () => {
    try {
        log('Starting migration validation...');

        await connectSQLite();

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

        const results = [];
        let totalOK = 0;
        let totalMismatch = 0;
        let totalError = 0;

        log('Validating tables...');
        for (const table of tables) {
            const result = await validateTable(table);
            results.push(result);

            if (result.status === 'OK') {
                totalOK++;
                log(`✓ ${table}: ${result.sqliteCount} rows`);
            } else if (result.status === 'MISMATCH' || result.status === 'DATA_MISMATCH') {
                totalMismatch++;
                warn(`✗ ${table}: ${result.status}`);
            } else {
                totalError++;
                error(`✗ ${table}: ${result.status}`);
            }
        }

        // Summary
        log('\n=== VALIDATION SUMMARY ===');
        log(`Total tables: ${tables.length}`);
        log(`OK: ${totalOK}`);
        log(`Mismatches: ${totalMismatch}`);
        log(`Errors: ${totalError}`);

        if (totalMismatch === 0 && totalError === 0) {
            log('\n✓ Migration validation PASSED');
            return true;
        } else {
            error('\n✗ Migration validation FAILED');
            error('Please review the mismatches and errors above');
            return false;
        }

    } catch (err) {
        error(`Validation failed: ${err.message}`);
        return false;
    } finally {
        if (sqliteDb) {
            sqliteDb.close();
        }
        await pgPool.end();
    }
};

// Run validation
validateMigration().then(success => {
    process.exit(success ? 0 : 1);
});
