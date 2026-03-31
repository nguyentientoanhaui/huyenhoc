# Render Deployment Guide

## Overview

This guide walks you through deploying the BaZi application to Render with Supabase PostgreSQL database.

## Prerequisites

- Render account (https://render.com)
- GitHub repository with code
- Supabase project with PostgreSQL database
- Environment variables configured

## Step 1: Prepare Your Repository

1. Ensure all code is committed to Git
2. Create `.env.production` files with production values
3. Verify `render.yaml` is in repository root
4. Test build locally:
   ```bash
   npm run build
   cd frontend && npm run build
   ```

## Step 2: Connect GitHub to Render

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Click "Connect account" to authorize GitHub
5. Select your repository
6. Click "Connect"

## Step 3: Configure Backend Service

### Basic Settings

1. **Name**: `bazi-backend`
2. **Environment**: `Node`
3. **Build Command**: `cd backendjs && npm install`
4. **Start Command**: `cd backendjs && npm start`
5. **Plan**: Standard (or higher for production)

### Environment Variables

Add these in Render dashboard:

```
NODE_ENV=production
TZ=Asia/Ho_Chi_Minh
PORT=8888
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[ANON_KEY]
OPENROUTER_API_KEY=[YOUR_API_KEY]
CORS_ORIGIN=https://bazi-frontend.render.com,http://localhost:3005
LOG_LEVEL=info
```

### Health Check

- **Path**: `/`
- **Interval**: 30 seconds
- **Timeout**: 5 seconds

### Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note the service URL (e.g., `https://bazi-backend.render.com`)

## Step 4: Configure Frontend Service

### Basic Settings

1. **Name**: `bazi-frontend`
2. **Environment**: `Static Site`
3. **Build Command**: `cd frontend && npm install && npm run build`
4. **Publish Directory**: `frontend/dist`

### Environment Variables

Add these in Render dashboard:

```
VITE_API_URL=https://bazi-backend.render.com
VITE_APP_VERSION=2.1
VITE_ENABLE_AI_CONSULTANT=true
VITE_ENABLE_MATCHING=true
VITE_ENABLE_ARTICLES=true
VITE_ENABLE_ADMIN_PANEL=true
```

### Routes (for SPA)

Add route to handle React Router:

```
Path: /*
Destination: /index.html
Type: Rewrite
```

### Deploy

1. Click "Create Static Site"
2. Wait for deployment to complete
3. Note the site URL (e.g., `https://bazi-frontend.render.com`)

## Step 5: Update Backend CORS

Update backend CORS configuration with frontend URL:

1. Go to backend service settings
2. Update `CORS_ORIGIN` environment variable:
   ```
   https://bazi-frontend.render.com,http://localhost:3005
   ```
3. Redeploy backend

## Step 6: Verify Deployment

### Test Backend

```bash
curl https://bazi-backend.render.com/
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

### Test Frontend

1. Open `https://bazi-frontend.render.com` in browser
2. Check browser console for errors
3. Test API calls (should connect to backend)

### Test Database Connection

```bash
curl https://bazi-backend.render.com/api/consultant/stats
```

Should return consultation statistics.

## Step 7: Setup Automatic Deployments

### GitHub Integration

1. Go to service settings
2. Under "Deploy", select "GitHub"
3. Choose branch to deploy from (usually `main`)
4. Enable "Auto-deploy" for automatic deployments on push

### Manual Deployment

To manually redeploy:

1. Go to service dashboard
2. Click "Manual Deploy"
3. Select branch
4. Click "Deploy"

## Step 8: Monitor Deployment

### View Logs

1. Go to service dashboard
2. Click "Logs" tab
3. View real-time logs

### Check Health

1. Go to service dashboard
2. Check "Health" status
3. View recent deployments

### Monitor Performance

1. Go to service dashboard
2. Check "Metrics" tab
3. Monitor CPU, memory, requests

## Troubleshooting

### Build Fails

**Error**: "npm install failed"

**Solution**:
1. Check `package.json` syntax
2. Verify all dependencies are available
3. Check Node.js version (18+)
4. Clear build cache and redeploy

**Error**: "Build command not found"

**Solution**:
1. Verify build command in `render.yaml`
2. Check working directory
3. Ensure script exists in `package.json`

### Deployment Fails

**Error**: "Service failed to start"

**Solution**:
1. Check logs for error messages
2. Verify environment variables are set
3. Check database connection
4. Verify start command is correct

### API Connection Issues

**Error**: "Cannot connect to backend"

**Solution**:
1. Verify backend service is running
2. Check CORS configuration
3. Verify API URL in frontend
4. Check browser console for errors

### Database Connection Issues

**Error**: "Database connection failed"

**Solution**:
1. Verify DATABASE_URL is correct
2. Check Supabase project is running
3. Verify database credentials
4. Check network connectivity

### Performance Issues

**Error**: "Slow response times"

**Solution**:
1. Check database query performance
2. Monitor CPU and memory usage
3. Check for rate limiting
4. Optimize API endpoints
5. Consider upgrading plan

## Environment Variables Reference

### Backend

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment | production |
| TZ | Timezone | Asia/Ho_Chi_Minh |
| PORT | Server port | 8888 |
| DATABASE_URL | PostgreSQL connection | postgresql://... |
| SUPABASE_URL | Supabase project URL | https://xxx.supabase.co |
| SUPABASE_ANON_KEY | Supabase anon key | xxx |
| OPENROUTER_API_KEY | OpenRouter API key | xxx |
| CORS_ORIGIN | Allowed origins | https://frontend.com |

### Frontend

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | https://backend.com |
| VITE_APP_VERSION | App version | 2.1 |
| VITE_ENABLE_* | Feature flags | true/false |

## Scaling

### Vertical Scaling

Upgrade plan for more resources:

1. Go to service settings
2. Click "Plan"
3. Select higher tier
4. Confirm upgrade

### Horizontal Scaling

Add more instances:

1. Go to service settings
2. Under "Scaling", increase "Num Instances"
3. Render will load balance between instances

## Backup and Recovery

### Database Backup

Supabase automatically backs up your database. To restore:

1. Go to Supabase dashboard
2. Click "Backups"
3. Select backup to restore
4. Click "Restore"

### Code Rollback

To rollback to previous deployment:

1. Go to service dashboard
2. Click "Deployments"
3. Select previous deployment
4. Click "Redeploy"

## Security Considerations

1. **Never commit `.env` files** with sensitive data
2. **Use environment variables** for all secrets
3. **Enable HTTPS** (Render does this automatically)
4. **Rotate API keys** regularly
5. **Monitor access logs** for suspicious activity
6. **Use strong database passwords**
7. **Enable rate limiting** on API endpoints

## Monitoring and Alerts

### Setup Alerts

1. Go to service settings
2. Click "Alerts"
3. Configure alerts for:
   - Service down
   - High CPU usage
   - High memory usage
   - Build failures

### View Metrics

1. Go to service dashboard
2. Click "Metrics"
3. Monitor:
   - CPU usage
   - Memory usage
   - Request count
   - Response time
   - Error rate

## Cost Optimization

1. **Use Standard plan** for production
2. **Monitor resource usage** and scale as needed
3. **Use caching** to reduce database queries
4. **Optimize images** and assets
5. **Clean up old deployments** to save storage

## Next Steps

1. Monitor application performance
2. Set up error tracking (Sentry)
3. Set up analytics (Google Analytics)
4. Configure custom domain
5. Set up CI/CD pipeline
6. Plan for scaling

## Support

For issues or questions:

1. Check Render documentation: https://render.com/docs
2. Check application logs
3. Contact Render support
4. Check GitHub issues

## Files Reference

- `render.yaml` - Render configuration
- `.env.production` - Production environment variables
- `backendjs/package.json` - Backend dependencies
- `frontend/package.json` - Frontend dependencies
- `backendjs/server.js` - Backend entry point
- `frontend/src/main.jsx` - Frontend entry point
