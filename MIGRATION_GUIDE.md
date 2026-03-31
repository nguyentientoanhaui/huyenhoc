# SQLite to PostgreSQL Migration Guide

## Overview

This guide walks you through migrating the BaZi application from SQLite to PostgreSQL (Supabase) for production deployment.

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (https://supabase.com)
- PostgreSQL client tools (optional, for manual verification)

## Step 1: Setup Supabase Project

Follow the detailed guide in `backendjs/scripts/setup-supabase.md`:

1. Create Supabase project
2. Get connection details
3. Get API keys
4. Create `.env.local` file with DATABASE_URL

## Step 2: Install Dependencies

```bash
cd tinix-bazi/backendjs
npm install
```

This installs the `pg` package needed for PostgreSQL connections.

## Step 3: Create Database Schema

The migration script automatically creates the schema, but you can also run it manually:

```bash
# Using psql (if installed)
psql $DATABASE_URL < scripts/schema.sql

# Or the migration script will create it automatically
```

## Step 4: Run Migration Script

```bash
cd tinix-bazi/backendjs

# Set environment variable
export DATABASE_URL="postgresql://postgres:[PASSWORD]@[project-id].supabase.co:5432/postgres"

# Run migration
node scripts/migrate-sqlite-to-postgres.js
```

Expected output:
```
[MIGRATION] 2024-01-15T10:30:00.000Z Connected to SQLite: data/bazi_consultant.db
[MIGRATION] 2024-01-15T10:30:00.100Z Connected to PostgreSQL
[MIGRATION] 2024-01-15T10:30:00.200Z Creating PostgreSQL schema...
[MIGRATION] 2024-01-15T10:30:01.000Z PostgreSQL schema created successfully
[MIGRATION] 2024-01-15T10:30:01.100Z Creating indexes...
[MIGRATION] 2024-01-15T10:30:02.000Z Indexes created successfully
[MIGRATION] 2024-01-15T10:30:02.100Z Migrating table: users
[MIGRATION] 2024-01-15T10:30:02.200Z Inserted 2/2 rows into users
...
[MIGRATION] 2024-01-15T10:30:05.000Z Migration completed! Total rows inserted: 1234
```

## Step 5: Validate Migration

```bash
# Run validation script
node scripts/validate-migration.js
```

Expected output:
```
[VALIDATE] 2024-01-15T10:30:10.000Z Starting migration validation...
[VALIDATE] 2024-01-15T10:30:10.100Z Connected to SQLite: data/bazi_consultant.db
[VALIDATE] 2024-01-15T10:30:10.200Z Validating tables...
[VALIDATE] 2024-01-15T10:30:10.300Z ✓ users: 2 rows
[VALIDATE] 2024-01-15T10:30:10.400Z ✓ customers: 150 rows
...
[VALIDATE] 2024-01-15T10:30:12.000Z === VALIDATION SUMMARY ===
[VALIDATE] 2024-01-15T10:30:12.100Z Total tables: 12
[VALIDATE] 2024-01-15T10:30:12.200Z OK: 12
[VALIDATE] 2024-01-15T10:30:12.300Z Mismatches: 0
[VALIDATE] 2024-01-15T10:30:12.400Z Errors: 0
[VALIDATE] 2024-01-15T10:30:12.500Z ✓ Migration validation PASSED
```

## Step 6: Update Backend Configuration

Update `backendjs/.env.production`:

```env
PORT=8888
NODE_ENV=production
TZ=Asia/Ho_Chi_Minh
DATABASE_URL=postgresql://postgres:[PASSWORD]@[project-id].supabase.co:5432/postgres
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[anon-key]
OPENROUTER_API_KEY=[your-api-key]
```

## Step 7: Update Backend Code

The backend code needs to be updated to use PostgreSQL instead of SQLite. This will be done in Phase 3.2 (Backend Configuration).

For now, the migration is complete and data is safely in PostgreSQL.

## Step 8: Test Connection

```bash
# Start backend with PostgreSQL
export DATABASE_URL="postgresql://postgres:[PASSWORD]@[project-id].supabase.co:5432/postgres"
npm start
```

Test health check:
```bash
curl http://localhost:8888/
```

Expected response:
```json
{
  "name": "BaZi Mega-Evolution API",
  "version": "2.1",
  "status": "running",
  "docs": "/api/docs"
}
```

## Troubleshooting

### Migration Script Fails

**Error: "ENOENT: no such file or directory"**
- Check SQLite database file exists at `data/bazi_consultant.db`
- Verify SQLITE_PATH environment variable is correct

**Error: "connect ECONNREFUSED"**
- Check DATABASE_URL is correct
- Verify Supabase project is running
- Check network connectivity

**Error: "password authentication failed"**
- Verify database password is correct
- Check username is `postgres`
- Verify database name is `postgres`

### Validation Script Fails

**Error: "Row count mismatch"**
- Check migration script completed successfully
- Verify no errors occurred during migration
- Check PostgreSQL database for data

**Error: "Data mismatch"**
- Check data types match between SQLite and PostgreSQL
- Verify data transformation is correct
- Check for NULL values or special characters

### Connection Issues

**Error: "SSL: CERTIFICATE_VERIFY_FAILED"**
- This is expected for Supabase
- The migration script handles this with `ssl: { rejectUnauthorized: false }`

**Error: "Connection timeout"**
- Check firewall settings
- Verify Supabase project is accessible
- Check network connectivity

## Rollback Procedure

If migration fails or you need to rollback:

```bash
# Keep SQLite database as backup
cp data/bazi_consultant.db data/bazi_consultant.db.backup

# Revert backend to use SQLite
git checkout backendjs/src/services/database.service.js

# Restart backend
npm start
```

## Backup and Recovery

### Backup PostgreSQL Database

```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restore from Backup

```bash
psql $DATABASE_URL < backup.sql
```

### Backup SQLite Database

```bash
cp data/bazi_consultant.db data/bazi_consultant.db.backup
```

## Performance Optimization

After migration, optimize PostgreSQL performance:

1. **Connection Pooling**: Supabase includes PgBouncer
2. **Indexes**: Already created by migration script
3. **Query Optimization**: Monitor slow queries in Supabase dashboard
4. **Caching**: Implement Redis for frequently accessed data (optional)

## Monitoring

Monitor migration and database health:

1. Check Supabase dashboard for:
   - Database health
   - Connection count
   - Query performance
   - Storage usage

2. Monitor application logs for:
   - Connection errors
   - Query errors
   - Performance issues

3. Set up alerts for:
   - High connection count
   - Slow queries
   - Storage near limit
   - API rate limit exceeded

## Next Steps

After successful migration:

1. Update backend code to use PostgreSQL (Phase 3.2)
2. Update frontend configuration (Phase 3.3)
3. Setup Render deployment (Phase 3.4)
4. Setup CI/CD pipeline (Phase 3.5)
5. Deploy to production

## Support

For issues or questions:

1. Check Supabase documentation: https://supabase.com/docs
2. Check PostgreSQL documentation: https://www.postgresql.org/docs/
3. Review migration script logs for detailed error messages
4. Check application logs for runtime errors

## Files Created

- `backendjs/scripts/migrate-sqlite-to-postgres.js` - Migration script
- `backendjs/scripts/validate-migration.js` - Validation script
- `backendjs/scripts/schema.sql` - PostgreSQL schema
- `backendjs/scripts/setup-supabase.md` - Supabase setup guide
- `MIGRATION_GUIDE.md` - This file
