# CI/CD Pipeline Troubleshooting Guide

## Quick Diagnosis

### Step 1: Check GitHub Actions Status

1. Go to your repository
2. Click "Actions" tab
3. Find the failed workflow run
4. Click on it to view details
5. Expand the failed job to see error messages

### Step 2: Check Render Dashboard

1. Go to https://dashboard.render.com
2. Select the service (bazi-backend or bazi-frontend)
3. Check "Deployments" tab for status
4. Check "Logs" tab for error messages

### Step 3: Identify the Stage

Determine which stage failed:
- **Lint**: Code quality issues
- **Build**: Compilation or build errors
- **Test**: Test failures
- **Deploy**: Render deployment issues
- **Health Check**: Application not responding

## Common Issues and Solutions

### Issue 1: Lint Stage Fails - ESLint Errors

**Error Message:**
```
ESLint errors found in frontend code
```

**Root Cause:**
- Code doesn't follow ESLint rules
- Unused variables or imports
- Syntax issues

**Solution:**

1. Check the specific error in GitHub Actions logs
2. Fix locally:
   ```bash
   cd frontend
   npm run lint
   ```
3. Review and fix the errors shown
4. Commit and push:
   ```bash
   git add .
   git commit -m "Fix ESLint errors"
   git push origin main
   ```

**Common ESLint Errors:**
- `no-unused-vars`: Remove unused variables
- `no-console`: Remove console.log statements
- `react-hooks/exhaustive-deps`: Add missing dependencies to useEffect
- `react-refresh/only-export-components`: Only export React components

### Issue 2: Build Stage Fails - Frontend Build Error

**Error Message:**
```
vite build failed
dist directory not found
```

**Root Cause:**
- Missing dependencies
- Syntax errors in source code
- Configuration issues

**Solution:**

1. Reproduce locally:
   ```bash
   cd frontend
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. Check for errors in build output
3. Common issues:
   - Missing import statements
   - Incorrect file paths
   - Invalid JSX syntax
   - Missing environment variables

4. Fix the error and push:
   ```bash
   git add .
   git commit -m "Fix frontend build error"
   git push origin main
   ```

**Example Fix:**
```javascript
// ✗ Wrong - missing import
export function MyComponent() {
  return <div>{data}</div>;
}

// ✓ Correct - import added
import { data } from './data';
export function MyComponent() {
  return <div>{data}</div>;
}
```

### Issue 3: Build Stage Fails - Backend Syntax Error

**Error Message:**
```
Backend syntax check failed
node -c server.js failed
```

**Root Cause:**
- Syntax error in JavaScript code
- Missing closing bracket or semicolon
- Invalid JSON in configuration

**Solution:**

1. Check the error in GitHub Actions logs
2. Reproduce locally:
   ```bash
   cd backendjs
   node -c server.js
   ```

3. Fix the syntax error
4. Verify:
   ```bash
   node -c server.js
   echo "Syntax OK"
   ```

5. Push the fix:
   ```bash
   git add .
   git commit -m "Fix backend syntax error"
   git push origin main
   ```

**Common Syntax Errors:**
- Missing closing brace `}`
- Missing semicolon `;`
- Incorrect arrow function syntax
- Mismatched quotes

### Issue 4: Deploy Stage Fails - Render Deployment Error

**Error Message:**
```
Deployment failed on Render
Check Render dashboard for details
```

**Root Cause:**
- Environment variables not set
- Database connection failed
- Port already in use
- Insufficient resources

**Solution:**

1. Check Render dashboard logs:
   - Go to https://dashboard.render.com
   - Select the service
   - Click "Logs" tab
   - Look for error messages

2. Common issues:

   **Missing Environment Variables:**
   ```
   Error: DATABASE_URL is not defined
   ```
   - Go to Service Settings → Environment
   - Add missing variables
   - Redeploy

   **Database Connection Failed:**
   ```
   Error: connect ECONNREFUSED
   ```
   - Verify DATABASE_URL is correct
   - Check Supabase is running
   - Verify network connectivity

   **Port Already in Use:**
   ```
   Error: listen EADDRINUSE :::8888
   ```
   - Check if another process is using port 8888
   - Restart the service

3. After fixing, redeploy:
   - Go to Render dashboard
   - Click "Manual Deploy" or "Redeploy"

### Issue 5: Health Check Fails - Backend Not Responding

**Error Message:**
```
Backend health check timed out
curl: (7) Failed to connect
```

**Root Cause:**
- Application crashed during startup
- Database connection failed
- Service not fully deployed yet
- Network connectivity issue

**Solution:**

1. Check Render logs:
   ```
   https://dashboard.render.com → Service → Logs
   ```

2. Look for startup errors:
   - Database connection errors
   - Missing environment variables
   - Port binding errors

3. Common fixes:

   **Database Connection Error:**
   ```
   Error: connect ECONNREFUSED
   ```
   - Verify DATABASE_URL environment variable
   - Check Supabase is running
   - Test connection locally

   **Missing Environment Variable:**
   ```
   Error: Cannot read property 'split' of undefined
   ```
   - Add missing environment variable in Render
   - Redeploy

   **Application Crash:**
   - Check error logs in Render dashboard
   - Fix the error in code
   - Push to main branch
   - Redeploy

4. Manual health check:
   ```bash
   curl https://bazi-backend.render.com/
   # Should return JSON with status "running"
   ```

### Issue 6: Health Check Fails - Frontend Not Responding

**Error Message:**
```
Frontend health check timed out
curl: (7) Failed to connect
```

**Root Cause:**
- Build artifacts not deployed
- Static site configuration issue
- CDN cache issue
- Network connectivity issue

**Solution:**

1. Check Render logs for build errors
2. Verify build artifacts exist:
   - Go to Render dashboard
   - Check "Deployments" tab
   - Look for build errors

3. Common fixes:

   **Build Failed:**
   - Check GitHub Actions logs for build errors
   - Fix the error in code
   - Push to main branch
   - Redeploy

   **Static Site Configuration:**
   - Verify `staticPublishPath: frontend/dist` in render.yaml
   - Verify routes configuration for SPA

   **CDN Cache Issue:**
   - Clear Render cache (if available)
   - Wait a few minutes for cache to expire
   - Try accessing from incognito window

4. Manual health check:
   ```bash
   curl https://bazi-frontend.render.com/
   # Should return HTML content
   ```

### Issue 7: Tests Fail

**Error Message:**
```
Frontend tests failed
Backend tests failed
```

**Root Cause:**
- Test code has errors
- Application code doesn't match test expectations
- Missing test dependencies
- Test environment not configured

**Solution:**

1. Check GitHub Actions logs for test output
2. Reproduce locally:
   ```bash
   # Frontend
   cd frontend
   npm test
   
   # Backend
   cd backendjs
   npm test
   ```

3. Fix the failing tests:
   - Update test code if test is wrong
   - Fix application code if implementation is wrong
   - Add missing test dependencies

4. Push the fix:
   ```bash
   git add .
   git commit -m "Fix failing tests"
   git push origin main
   ```

**Note:** Test failures don't block deployment (continue-on-error: true)

### Issue 8: Workflow Doesn't Trigger

**Error Message:**
```
No workflow runs in GitHub Actions
```

**Root Cause:**
- Workflow file has syntax error
- Workflow not on main branch
- GitHub Actions not enabled
- Workflow file not in .github/workflows/

**Solution:**

1. Verify workflow file exists:
   ```
   .github/workflows/deploy.yml
   .github/workflows/lint.yml
   ```

2. Check workflow syntax:
   - Go to GitHub → Actions tab
   - Look for "Invalid workflow" message
   - Fix YAML syntax errors

3. Verify GitHub Actions is enabled:
   - Go to Repository Settings
   - Click "Actions" → "General"
   - Ensure "Allow all actions and reusable workflows" is selected

4. Verify you're pushing to main branch:
   ```bash
   git branch
   # Should show * main
   ```

5. If still not working:
   - Delete and recreate the workflow file
   - Ensure proper YAML indentation
   - Check for special characters

### Issue 9: Deployment Succeeds but Application Doesn't Work

**Error Message:**
```
Deployment successful but API returns 500 errors
Frontend loads but can't connect to backend
```

**Root Cause:**
- Environment variables not set correctly
- Database connection issue
- CORS configuration issue
- Application logic error

**Solution:**

1. Check application logs:
   ```
   https://dashboard.render.com → Service → Logs
   ```

2. Verify environment variables:
   ```
   https://dashboard.render.com → Service → Settings → Environment
   ```

3. Test API endpoints:
   ```bash
   curl https://bazi-backend.render.com/
   # Should return JSON with status "running"
   
   curl https://bazi-backend.render.com/api/analyze
   # Should return analysis data or error
   ```

4. Check CORS configuration:
   ```bash
   curl -H "Origin: https://bazi-frontend.render.com" \
        -H "Access-Control-Request-Method: GET" \
        https://bazi-backend.render.com/
   # Should include Access-Control-Allow-Origin header
   ```

5. Common fixes:
   - Update DATABASE_URL if database changed
   - Update CORS_ORIGIN if frontend URL changed
   - Restart the service
   - Check application code for errors

### Issue 10: Rollback Needed

**Scenario:**
```
Deployment broke the application
Need to revert to previous version
```

**Solution:**

1. **Identify the Issue:**
   - Check Render logs for errors
   - Check GitHub Actions logs
   - Check application functionality

2. **Rollback Backend:**
   ```
   1. Go to https://dashboard.render.com
   2. Select 'bazi-backend' service
   3. Click 'Deployments' tab
   4. Find the previous successful deployment
   5. Click 'Redeploy' to rollback
   ```

3. **Rollback Frontend:**
   ```
   1. Go to https://dashboard.render.com
   2. Select 'bazi-frontend' service
   3. Click 'Deployments' tab
   4. Find the previous successful deployment
   5. Click 'Redeploy' to rollback
   ```

4. **Verify Rollback:**
   ```bash
   curl https://bazi-backend.render.com/
   curl https://bazi-frontend.render.com/
   ```

5. **Fix and Re-deploy:**
   - Fix the issue in code
   - Push to main branch
   - GitHub Actions will trigger new deployment

## Debugging Techniques

### 1. Enable Debug Logging

Add debug output to workflow:

```yaml
- name: Debug Information
  run: |
    echo "Node version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "Current directory: $(pwd)"
    echo "Directory contents:"
    ls -la
```

### 2. Check Environment Variables

```yaml
- name: Check Environment Variables
  run: |
    echo "NODE_ENV: $NODE_ENV"
    echo "PORT: $PORT"
    # Don't print sensitive variables!
```

### 3. Test Commands Locally

Before pushing, test all commands locally:

```bash
# Frontend
cd frontend
npm install
npm run lint
npm run build
npm test

# Backend
cd backendjs
npm install
node -c server.js
npm test
```

### 4. Use Verbose Output

Add verbose flags to commands:

```bash
npm install --verbose
npm run build -- --debug
```

### 5. Check File Permissions

```bash
ls -la frontend/dist/
ls -la backendjs/
```

## Performance Optimization

### 1. Cache Dependencies

The workflow already uses npm caching:

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

### 2. Parallel Jobs

Jobs run in parallel when possible:
- Lint and Build can run in parallel
- Test runs after Build
- Deploy runs after Test

### 3. Artifact Management

Artifacts are cleaned up after 1 day:

```yaml
retention-days: 1
```

## Security Best Practices

### 1. Secrets Management

Never commit sensitive data:
- Use GitHub Secrets for API keys
- Use Render environment variables for production secrets
- Don't print secrets in logs

### 2. Dependency Security

Check for vulnerable dependencies:

```bash
npm audit
npm audit fix
```

### 3. Code Review

Always review code before merging:
- Use pull requests
- Require code review approval
- Run automated checks

## Monitoring and Alerts

### 1. GitHub Actions Notifications

Enable in GitHub Settings:
- Settings → Notifications
- Enable "Workflow runs"

### 2. Render Notifications

Enable in Render:
- Account Settings → Notifications
- Enable deployment notifications

### 3. Manual Monitoring

Check regularly:
- GitHub Actions: https://github.com/[user]/[repo]/actions
- Render Dashboard: https://dashboard.render.com
- Application Logs: Render → Service → Logs

## Getting Help

### 1. Check Logs

Always start by checking logs:
- GitHub Actions logs
- Render deployment logs
- Application runtime logs

### 2. Search for Similar Issues

- GitHub Issues: https://github.com/[user]/[repo]/issues
- Stack Overflow: https://stackoverflow.com
- GitHub Discussions: https://github.com/[user]/[repo]/discussions

### 3. Contact Support

- GitHub Support: https://support.github.com
- Render Support: https://render.com/support
- Node.js Community: https://nodejs.org/en/get-involved/

## Checklist for Troubleshooting

When something goes wrong:

- [ ] Check GitHub Actions logs
- [ ] Check Render dashboard logs
- [ ] Verify environment variables
- [ ] Test commands locally
- [ ] Check for syntax errors
- [ ] Verify file permissions
- [ ] Check network connectivity
- [ ] Review recent code changes
- [ ] Check dependency versions
- [ ] Try rolling back to previous version
- [ ] Clear caches if needed
- [ ] Restart services if needed
- [ ] Contact support if still stuck

## Quick Reference

### Common Commands

```bash
# Check syntax
node -c server.js

# Run linting
npm run lint

# Build frontend
npm run build

# Run tests
npm test

# Check npm audit
npm audit

# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Useful URLs

- GitHub Actions: https://github.com/[user]/[repo]/actions
- Render Dashboard: https://dashboard.render.com
- Render Logs: https://dashboard.render.com → Service → Logs
- GitHub Secrets: https://github.com/[user]/[repo]/settings/secrets/actions
- Render Environment: https://dashboard.render.com → Service → Settings → Environment

### Log Locations

- GitHub Actions: https://github.com/[user]/[repo]/actions → Workflow Run → Job
- Render Build: https://dashboard.render.com → Service → Deployments → Deployment
- Render Runtime: https://dashboard.render.com → Service → Logs
- Application: Check application error logs or monitoring service
