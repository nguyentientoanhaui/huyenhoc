# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create account
3. Click "New Project"
4. Fill in project details:
   - **Name**: bazi-production (or your preferred name)
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users (e.g., Singapore for Vietnam)
5. Click "Create new project"
6. Wait for project to be created (5-10 minutes)

## Step 2: Get Connection Details

1. Go to Project Settings → Database
2. Copy the following:
   - **Host**: `[project-id].supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: Your database password from Step 1

3. Create DATABASE_URL:
   ```
   postgresql://postgres:[PASSWORD]@[project-id].supabase.co:5432/postgres
   ```

## Step 3: Get API Keys

1. Go to Project Settings → API
2. Copy:
   - **Project URL**: `https://[project-id].supabase.co`
   - **anon public**: Your anonymous key
   - **service_role secret**: Your service role key

3. Set environment variables:
   ```
   SUPABASE_URL=https://[project-id].supabase.co
   SUPABASE_ANON_KEY=[anon-key]
   SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
   ```

## Step 4: Run Migration Script

1. Create `.env.local` file in `backendjs/` directory:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[project-id].supabase.co:5432/postgres
   ```

2. Install PostgreSQL client:
   ```bash
   npm install pg
   ```

3. Run migration script:
   ```bash
   cd backendjs
   node scripts/migrate-sqlite-to-postgres.js
   ```

4. Verify migration completed successfully

## Step 5: Update Backend Configuration

1. Update `backendjs/.env.production`:
   ```
   PORT=8888
   NODE_ENV=production
   TZ=Asia/Ho_Chi_Minh
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[project-id].supabase.co:5432/postgres
   SUPABASE_URL=https://[project-id].supabase.co
   SUPABASE_ANON_KEY=[anon-key]
   OPENROUTER_API_KEY=[your-api-key]
   ```

2. Update `backendjs/src/services/database.service.js` to use PostgreSQL

## Step 6: Test Connection

1. Run backend locally:
   ```bash
   cd backendjs
   npm start
   ```

2. Test health check:
   ```bash
   curl http://localhost:8888/
   ```

3. Test API endpoint:
   ```bash
   curl "http://localhost:8888/api/analyze?year=1990&month=1&day=1"
   ```

## Troubleshooting

### Connection Refused
- Check DATABASE_URL is correct
- Verify Supabase project is running
- Check firewall/network settings

### Authentication Failed
- Verify password is correct
- Check username is `postgres`
- Verify database name is `postgres`

### Migration Failed
- Check SQLite database file exists
- Verify PostgreSQL schema was created
- Check error logs for details

### Slow Queries
- Verify indexes were created
- Check connection pool settings
- Monitor database performance in Supabase dashboard

## Backup and Recovery

### Backup PostgreSQL Database
```bash
pg_dump postgresql://postgres:[PASSWORD]@[project-id].supabase.co:5432/postgres > backup.sql
```

### Restore from Backup
```bash
psql postgresql://postgres:[PASSWORD]@[project-id].supabase.co:5432/postgres < backup.sql
```

### Rollback to SQLite
If migration fails, keep SQLite database as backup:
```bash
# Keep original SQLite database
cp data/bazi_consultant.db data/bazi_consultant.db.backup

# Revert backend to use SQLite
git checkout backendjs/src/services/database.service.js
```

## Security Considerations

1. **Never commit credentials** to Git
2. **Use environment variables** for sensitive data
3. **Enable SSL** for database connections (Supabase does this by default)
4. **Rotate API keys** regularly
5. **Monitor access logs** for suspicious activity
6. **Use strong passwords** for database
7. **Enable Row Level Security (RLS)** for sensitive tables (optional)

## Performance Optimization

1. **Connection Pooling**: Use PgBouncer (included with Supabase)
2. **Indexes**: Already created by migration script
3. **Query Optimization**: Monitor slow queries in Supabase dashboard
4. **Caching**: Implement Redis for frequently accessed data (optional)
5. **Read Replicas**: Available in Supabase Pro plan

## Monitoring

1. Go to Supabase Dashboard
2. Check:
   - Database health
   - Connection count
   - Query performance
   - Storage usage
   - API usage

3. Set up alerts for:
   - High connection count
   - Slow queries
   - Storage near limit
   - API rate limit exceeded
