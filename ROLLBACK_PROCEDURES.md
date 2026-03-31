# Rollback Procedures

## Overview

This guide provides step-by-step procedures for rolling back deployments when issues occur. Rollback is the process of reverting to a previous, known-good version of the application.

## When to Rollback

### Immediate Rollback Required

- **Critical Errors**: Application crashes or is completely unavailable
- **Data Loss**: Database corruption or data loss detected
- **Security Issues**: Security vulnerability discovered in deployed code
- **Performance Degradation**: Application performance severely degraded
- **Service Outage**: Service is down and affecting users

### Delayed Rollback (Can Wait)

- **Minor Bugs**: Non-critical functionality broken
- **UI Issues**: Visual or layout problems
- **Performance Issues**: Slight performance degradation
- **Feature Issues**: New feature not working as expected

## Rollback Decision Tree

```
Issue Detected
    ↓
Is it critical? (affects users, data loss, security)
    ├─ YES → Immediate Rollback
    │         ↓
    │         1. Identify last good deployment
    │         2. Redeploy previous version
    │         3. Verify application works
    │         4. Notify team
    │         5. Investigate root cause
    │
    └─ NO → Delayed Rollback
             ↓
             1. Investigate issue
             2. Prepare fix
             3. Test fix locally
             4. Deploy fix
             5. Monitor for issues
```

## Rollback Procedures

### Procedure 1: Rollback Backend Service

**Time Required:** 2-5 minutes

**Steps:**

1. **Access Render Dashboard**
   ```
   Go to: https://dashboard.render.com
   ```

2. **Select Backend Service**
   ```
   Click: bazi-backend
   ```

3. **View Deployments**
   ```
   Click: Deployments tab
   ```

4. **Find Previous Deployment**
   ```
   Look for the last successful deployment
   Status should show: "Live" or "Deployed"
   ```

5. **Redeploy Previous Version**
   ```
   Click: "Redeploy" button next to previous deployment
   Confirm: Click "Redeploy" in confirmation dialog
   ```

6. **Monitor Deployment**
   ```
   Watch the deployment progress
   Status should change from "Building" to "Live"
   Duration: Usually 1-3 minutes
   ```

7. **Verify Health Check**
   ```bash
   curl https://bazi-backend.render.com/
   # Should return JSON with status "running"
   ```

8. **Verify API Endpoints**
   ```bash
   curl https://bazi-backend.render.com/api/analyze
   # Should return data or expected error
   ```

9. **Notify Team**
   ```
   Send message to team:
   "Backend rolled back to previous version"
   "Reason: [describe issue]"
   "Status: Investigating root cause"
   ```

### Procedure 2: Rollback Frontend Service

**Time Required:** 2-5 minutes

**Steps:**

1. **Access Render Dashboard**
   ```
   Go to: https://dashboard.render.com
   ```

2. **Select Frontend Service**
   ```
   Click: bazi-frontend
   ```

3. **View Deployments**
   ```
   Click: Deployments tab
   ```

4. **Find Previous Deployment**
   ```
   Look for the last successful deployment
   Status should show: "Live" or "Deployed"
   ```

5. **Redeploy Previous Version**
   ```
   Click: "Redeploy" button next to previous deployment
   Confirm: Click "Redeploy" in confirmation dialog
   ```

6. **Monitor Deployment**
   ```
   Watch the deployment progress
   Status should change from "Building" to "Live"
   Duration: Usually 1-3 minutes
   ```

7. **Clear Browser Cache**
   ```
   Open: https://bazi-frontend.render.com
   Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   Or: Open in incognito window
   ```

8. **Verify Application**
   ```
   Check that application loads
   Check that UI displays correctly
   Check that API calls work
   ```

9. **Notify Team**
   ```
   Send message to team:
   "Frontend rolled back to previous version"
   "Reason: [describe issue]"
   "Status: Investigating root cause"
   ```

### Procedure 3: Rollback Both Services

**Time Required:** 5-10 minutes

**Steps:**

1. **Rollback Backend First**
   - Follow Procedure 1: Rollback Backend Service
   - Wait for deployment to complete
   - Verify health check passes

2. **Rollback Frontend**
   - Follow Procedure 2: Rollback Frontend Service
   - Wait for deployment to complete
   - Verify application loads

3. **Verify Integration**
   ```bash
   # Test frontend-backend communication
   curl https://bazi-frontend.render.com/
   # Should load without errors
   
   # Check browser console for errors
   # Open: https://bazi-frontend.render.com
   # Press: F12 to open developer tools
   # Check: Console tab for errors
   ```

4. **Notify Team**
   ```
   Send message to team:
   "Both services rolled back to previous versions"
   "Reason: [describe issue]"
   "Status: Investigating root cause"
   "ETA for fix: [estimate]"
   ```

### Procedure 4: Rollback Database (if needed)

**Time Required:** 10-30 minutes (depending on backup size)

**Prerequisites:**
- Database backup available
- Backup location documented
- Restore procedure tested

**Steps:**

1. **Identify Issue**
   ```
   Determine if database rollback is needed:
   - Data corruption detected
   - Incorrect data in database
   - Migration failed
   - Schema changed unexpectedly
   ```

2. **Stop Backend Service**
   ```
   Go to: https://dashboard.render.com
   Select: bazi-backend
   Click: Settings → Suspend Service
   Reason: Database rollback in progress
   ```

3. **Backup Current Database**
   ```
   Go to: Supabase Dashboard
   Select: Database
   Click: Backups
   Click: "Create backup"
   Wait for backup to complete
   ```

4. **Restore from Backup**
   ```
   Go to: Supabase Dashboard
   Select: Database
   Click: Backups
   Find: Previous backup
   Click: "Restore"
   Confirm: Click "Restore" in confirmation dialog
   Wait for restore to complete (5-30 minutes)
   ```

5. **Verify Database**
   ```
   Go to: Supabase Dashboard
   Select: Database
   Click: SQL Editor
   Run: SELECT COUNT(*) FROM customers;
   Verify: Row count matches expected value
   ```

6. **Resume Backend Service**
   ```
   Go to: https://dashboard.render.com
   Select: bazi-backend
   Click: Settings → Resume Service
   Wait for service to start
   ```

7. **Verify Backend**
   ```bash
   curl https://bazi-backend.render.com/
   # Should return JSON with status "running"
   ```

8. **Notify Team**
   ```
   Send message to team:
   "Database rolled back to previous backup"
   "Backup timestamp: [date/time]"
   "Data restored: [describe what was restored]"
   "Status: Investigating root cause"
   ```

## Rollback Verification Checklist

After rolling back, verify:

- [ ] Backend service is running
- [ ] Frontend service is running
- [ ] Health check endpoint responds
- [ ] API endpoints respond correctly
- [ ] Frontend loads without errors
- [ ] Frontend-backend communication works
- [ ] Database connectivity verified
- [ ] No error messages in logs
- [ ] Application functionality works
- [ ] Performance is acceptable
- [ ] No data loss detected
- [ ] Team notified of rollback

## Post-Rollback Investigation

### Step 1: Identify Root Cause

1. **Check Logs**
   ```
   GitHub Actions: https://github.com/[user]/[repo]/actions
   Render Backend: https://dashboard.render.com → bazi-backend → Logs
   Render Frontend: https://dashboard.render.com → bazi-frontend → Logs
   ```

2. **Review Recent Changes**
   ```
   GitHub: https://github.com/[user]/[repo]/commits/main
   Look for: Recent commits before rollback
   Check: What changed in the code
   ```

3. **Check Environment Variables**
   ```
   Render: https://dashboard.render.com → Service → Settings → Environment
   Verify: All variables are set correctly
   Check: No typos or missing values
   ```

4. **Review Error Messages**
   ```
   Look for: Specific error messages in logs
   Search: Error message in documentation
   Check: Stack traces for clues
   ```

### Step 2: Prepare Fix

1. **Create Fix Branch**
   ```bash
   git checkout -b fix/issue-description
   ```

2. **Implement Fix**
   ```bash
   # Make necessary code changes
   # Test locally
   npm run lint
   npm run build
   npm test
   ```

3. **Test Thoroughly**
   ```bash
   # Test all affected functionality
   # Test edge cases
   # Test with production data (if possible)
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "Fix: [description of fix]"
   ```

### Step 3: Deploy Fix

1. **Create Pull Request**
   ```
   Push branch to GitHub
   Create pull request to main
   Wait for GitHub Actions checks to pass
   Request code review
   ```

2. **Merge to Main**
   ```
   After approval, merge pull request
   GitHub Actions will trigger deployment
   Monitor deployment progress
   ```

3. **Verify Deployment**
   ```bash
   curl https://bazi-backend.render.com/
   curl https://bazi-frontend.render.com/
   # Verify application works correctly
   ```

## Rollback Scenarios

### Scenario 1: Frontend Build Fails

**Issue:** Frontend build fails, deployment blocked

**Rollback:**
1. Go to Render dashboard
2. Select bazi-frontend
3. Click Deployments
4. Find last successful deployment
5. Click Redeploy

**Investigation:**
1. Check GitHub Actions logs for build error
2. Fix the error in code
3. Push to main branch
4. GitHub Actions will retry

### Scenario 2: Backend Crashes on Startup

**Issue:** Backend service crashes immediately after deployment

**Rollback:**
1. Go to Render dashboard
2. Select bazi-backend
3. Click Deployments
4. Find last successful deployment
5. Click Redeploy

**Investigation:**
1. Check Render logs for startup error
2. Common causes:
   - Missing environment variable
   - Database connection failed
   - Syntax error in code
3. Fix the issue
4. Push to main branch

### Scenario 3: Database Connection Fails

**Issue:** Backend can't connect to database

**Rollback:**
1. Check DATABASE_URL environment variable
2. Verify Supabase is running
3. Test connection manually
4. If needed, rollback database from backup

**Investigation:**
1. Verify DATABASE_URL is correct
2. Check Supabase status
3. Check network connectivity
4. Review recent database changes

### Scenario 4: CORS Errors

**Issue:** Frontend can't communicate with backend

**Rollback:**
1. Check CORS_ORIGIN environment variable
2. Verify frontend URL is in whitelist
3. Restart backend service
4. Clear browser cache

**Investigation:**
1. Check CORS configuration in backend
2. Verify frontend URL matches
3. Check browser console for errors
4. Review recent CORS changes

### Scenario 5: Data Corruption

**Issue:** Database contains corrupted or incorrect data

**Rollback:**
1. Stop backend service
2. Restore database from backup
3. Verify data integrity
4. Resume backend service

**Investigation:**
1. Identify what data was corrupted
2. Determine when corruption occurred
3. Review recent database changes
4. Check for migration errors

## Rollback Communication

### Internal Team Notification

```
Subject: Rollback - [Service Name]

Team,

We have rolled back [service name] to the previous version due to [brief description of issue].

Details:
- Service: [bazi-backend / bazi-frontend / both]
- Rollback time: [timestamp]
- Previous version: [commit hash]
- Reason: [description]
- Status: [investigating / fixed / monitoring]
- ETA for fix: [estimate]

Impact:
- Users: [describe impact]
- Data: [describe data impact]
- Functionality: [describe functionality impact]

Next steps:
1. Investigate root cause
2. Prepare fix
3. Test fix locally
4. Deploy fix to main branch
5. Monitor for issues

Questions? Contact [on-call engineer]
```

### User-Facing Notification (if needed)

```
We experienced a brief service interruption and have rolled back to a previous version.

Status: Service is now operational
Impact: [describe what was affected]
Duration: [how long it was down]
Next steps: We are investigating the issue and will deploy a fix shortly

Thank you for your patience.
```

## Rollback Automation

### Automatic Rollback on Health Check Failure

The CI/CD pipeline includes health checks after deployment. If health checks fail:

1. Deployment is marked as failed
2. Render may automatically rollback (if configured)
3. Team is notified
4. Manual investigation required

### Manual Rollback Trigger

To manually trigger a rollback:

1. Go to Render dashboard
2. Select service
3. Click Deployments
4. Find previous deployment
5. Click Redeploy

## Rollback Limitations

### What Can Be Rolled Back

- ✓ Application code (frontend and backend)
- ✓ Environment variables (if changed)
- ✓ Service configuration
- ✓ Database schema (with backup)

### What Cannot Be Rolled Back

- ✗ Data changes (unless database is rolled back)
- ✗ User actions (if they occurred after deployment)
- ✗ Third-party service changes
- ✗ DNS changes

## Rollback Best Practices

1. **Keep Deployments Small**
   - Deploy frequently with small changes
   - Easier to identify issues
   - Faster rollback if needed

2. **Test Before Deployment**
   - Run all tests locally
   - Test in staging environment
   - Get code review approval

3. **Monitor After Deployment**
   - Watch logs for errors
   - Monitor performance metrics
   - Check user reports

4. **Document Changes**
   - Write clear commit messages
   - Document breaking changes
   - Document database migrations

5. **Maintain Backups**
   - Regular database backups
   - Keep previous deployments available
   - Document backup procedures

6. **Have Runbook**
   - Document rollback procedures
   - Keep procedures up to date
   - Practice rollback procedures

## Rollback Checklist

Before deploying to production:

- [ ] Rollback procedures documented
- [ ] Team trained on rollback
- [ ] Backups configured and tested
- [ ] Previous deployments available
- [ ] Health checks configured
- [ ] Monitoring configured
- [ ] On-call schedule defined
- [ ] Communication plan ready
- [ ] Rollback tested in staging
- [ ] Estimated rollback time documented

## Support and Resources

- Render Deployments: https://render.com/docs/deployments
- Render Rollback: https://render.com/docs/rollback
- GitHub Actions: https://docs.github.com/en/actions
- Supabase Backups: https://supabase.com/docs/guides/database/backups
- PostgreSQL Recovery: https://www.postgresql.org/docs/current/backup.html
