# Deployment Checklist

## Pre-Deployment Checklist

### Code Quality
- [ ] All code changes committed to Git
- [ ] No console.log statements in production code
- [ ] No hardcoded credentials in code
- [ ] ESLint passes: `npm run lint`
- [ ] No TypeScript errors
- [ ] All tests pass: `npm test`

### Database
- [ ] Supabase project created
- [ ] PostgreSQL database initialized
- [ ] Migration script tested with sample data
- [ ] Data integrity verified
- [ ] Backup created
- [ ] Connection string verified

### Backend Configuration
- [ ] `.env.production` created with all variables
- [ ] DATABASE_URL configured
- [ ] SUPABASE_* keys configured
- [ ] OPENROUTER_API_KEY configured
- [ ] CORS_ORIGIN configured
- [ ] PORT set to 8888
- [ ] NODE_ENV set to production
- [ ] TZ set to Asia/Ho_Chi_Minh

### Frontend Configuration
- [ ] `.env.production` created
- [ ] VITE_API_URL configured
- [ ] Feature flags configured
- [ ] Build tested locally: `npm run build`
- [ ] Production build verified: `npm run preview`
- [ ] No console errors in production build

### Render Configuration
- [ ] GitHub account connected to Render
- [ ] Repository authorized
- [ ] `render.yaml` created and validated
- [ ] Backend service configured
- [ ] Frontend service configured
- [ ] Environment variables set on Render
- [ ] Health check configured

### Security
- [ ] No `.env` files committed to Git
- [ ] All secrets in environment variables
- [ ] HTTPS enabled (automatic on Render)
- [ ] CORS whitelist configured
- [ ] Rate limiting configured
- [ ] Database password is strong
- [ ] API keys rotated

### Documentation
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] Troubleshooting guide available
- [ ] Rollback procedure documented
- [ ] Team notified of deployment

## Deployment Steps

### Step 1: Database Migration
- [ ] Run migration script: `node scripts/migrate-sqlite-to-postgres.js`
- [ ] Validate migration: `node scripts/validate-migration.js`
- [ ] Verify data integrity
- [ ] Create backup

### Step 2: Deploy Backend
- [ ] Push code to main branch
- [ ] Render automatically builds
- [ ] Monitor build logs
- [ ] Verify health check passes
- [ ] Test API endpoints
- [ ] Check error logs

### Step 3: Deploy Frontend
- [ ] Frontend build starts automatically
- [ ] Monitor build logs
- [ ] Verify assets load correctly
- [ ] Test React Router navigation
- [ ] Check browser console for errors

### Step 4: Verify Deployment
- [ ] Health check endpoint responds: `curl https://bazi-backend.render.com/`
- [ ] API endpoints accessible
- [ ] Frontend loads correctly
- [ ] CORS headers present
- [ ] Database connection working
- [ ] API calls successful

### Step 5: Post-Deployment
- [ ] Monitor error logs
- [ ] Monitor performance metrics
- [ ] Verify access logs recorded
- [ ] Test all features
- [ ] Check mobile responsiveness
- [ ] Verify email notifications (if applicable)

## Post-Deployment Checklist

### Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Google Analytics)
- [ ] Performance monitoring enabled
- [ ] Alerts configured
- [ ] Logs being collected

### Testing
- [ ] Manual testing completed
- [ ] All API endpoints tested
- [ ] Authentication tested
- [ ] Database operations tested
- [ ] Error handling tested
- [ ] Rate limiting tested

### Documentation
- [ ] Deployment documented
- [ ] Issues logged
- [ ] Lessons learned documented
- [ ] Team updated
- [ ] Runbook created

### Optimization
- [ ] Performance metrics reviewed
- [ ] Database queries optimized
- [ ] Caching configured
- [ ] Bundle size optimized
- [ ] Images optimized

## Rollback Checklist

If deployment fails:

### Immediate Actions
- [ ] Identify root cause
- [ ] Check error logs
- [ ] Review recent changes
- [ ] Notify team

### Rollback Steps
- [ ] Revert to previous backend deployment
- [ ] Revert to previous frontend deployment
- [ ] Verify health checks pass
- [ ] Test API endpoints
- [ ] Verify database integrity

### Post-Rollback
- [ ] Investigate root cause
- [ ] Fix issues
- [ ] Re-test locally
- [ ] Plan re-deployment
- [ ] Document lessons learned

## Environment Variables Checklist

### Backend Variables
- [ ] NODE_ENV=production
- [ ] TZ=Asia/Ho_Chi_Minh
- [ ] PORT=8888
- [ ] DATABASE_URL=postgresql://...
- [ ] SUPABASE_URL=https://...
- [ ] SUPABASE_ANON_KEY=...
- [ ] OPENROUTER_API_KEY=...
- [ ] CORS_ORIGIN=https://...

### Frontend Variables
- [ ] VITE_API_URL=https://...
- [ ] VITE_APP_VERSION=2.1
- [ ] VITE_ENABLE_AI_CONSULTANT=true
- [ ] VITE_ENABLE_MATCHING=true
- [ ] VITE_ENABLE_ARTICLES=true
- [ ] VITE_ENABLE_ADMIN_PANEL=true

## Performance Targets

- [ ] API response time < 500ms
- [ ] Frontend load time < 3s
- [ ] Database query time < 100ms
- [ ] Error rate < 0.1%
- [ ] Uptime > 99.9%

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Input validation enabled
- [ ] SQL injection prevention enabled
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Security headers configured

## Monitoring Checklist

- [ ] Error tracking enabled
- [ ] Performance monitoring enabled
- [ ] Access logs enabled
- [ ] Database monitoring enabled
- [ ] Alerts configured
- [ ] Dashboards created
- [ ] Runbooks created

## Sign-Off

- [ ] Backend deployment verified by: _______________
- [ ] Frontend deployment verified by: _______________
- [ ] Database migration verified by: _______________
- [ ] Security review completed by: _______________
- [ ] Performance review completed by: _______________
- [ ] Deployment approved by: _______________

Date: _______________
Time: _______________
