# CI/CD Pipeline Setup Guide

## Overview

This guide explains the GitHub Actions CI/CD pipeline for the BaZi application deployment to Render. The pipeline automates testing, building, and deployment processes to ensure code quality and reliable deployments.

## Architecture

```
Developer Push to main
    ↓
GitHub Actions Triggered
    ↓
┌─────────────────────────────────────┐
│ 1. Lint Stage                       │
│    - ESLint (Frontend)              │
│    - Syntax Check (Backend)         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 2. Build Stage                      │
│    - Build Frontend (Vite)          │
│    - Verify Backend                 │
│    - Upload Artifacts               │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 3. Test Stage                       │
│    - Frontend Tests (if configured) │
│    - Backend Tests (if configured)  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 4. Deploy Stage (main branch only)  │
│    - Trigger Render Deployment      │
│    - Health Checks                  │
│    - Notifications                  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 5. Rollback (if deployment fails)   │
│    - Manual Rollback Instructions   │
│    - Failure Notifications          │
└─────────────────────────────────────┘
```

## Workflows

### 1. Main Deployment Workflow (deploy.yml)

**Trigger:** Push to main branch or pull request

**Stages:**

#### Lint Stage
- Installs dependencies
- Runs ESLint on frontend code
- Performs syntax check on backend code
- Continues on error (warnings don't block deployment)

#### Build Stage
- Builds frontend with Vite
- Verifies dist directory and index.html exist
- Checks backend syntax
- Uploads frontend build artifacts

#### Test Stage
- Runs frontend tests (if configured)
- Runs backend tests (if configured)
- Continues on error (missing tests don't block deployment)

#### Deploy Stage (main branch only)
- Triggers Render deployment
- Waits 30 seconds for deployment to start
- Performs health checks on backend and frontend
- Provides deployment status and next steps

#### Rollback Stage (on failure)
- Provides manual rollback instructions
- Documents investigation steps
- Explains re-deployment process

### 2. Linting Workflow (lint.yml)

**Trigger:** Push to main/develop or pull request

**Stages:**

#### Frontend Linting
- Runs ESLint on all frontend code
- Fails on linting errors

#### Backend Syntax Check
- Validates server.js syntax
- Validates all src/*.js files
- Continues on error

#### Dependency Security Check
- Runs npm audit on frontend
- Runs npm audit on backend
- Continues on error (warnings don't block)

## Setup Instructions

### 1. GitHub Repository Setup

The workflows are already configured in `.github/workflows/`. No additional setup is needed for GitHub Actions to detect them.

### 2. Render Deployment Hook (Optional)

For automatic Render deployment without manual trigger:

1. Go to Render Dashboard: https://dashboard.render.com
2. Select your service (bazi-backend or bazi-frontend)
3. Go to Settings → Deploy Hook
4. Copy the deploy hook URL
5. Add to GitHub Secrets:
   - Go to Repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `RENDER_DEPLOY_HOOK`
   - Value: Paste the deploy hook URL

**Note:** The current workflow uses Render's automatic Git integration, so this is optional.

### 3. Environment Variables in Render

Ensure these environment variables are set in Render dashboard:

**Backend Service (bazi-backend):**
```
NODE_ENV=production
TZ=Asia/Ho_Chi_Minh
PORT=8888
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
OPENROUTER_API_KEY=xxxxx
CORS_ORIGIN=https://bazi-frontend.render.com,http://localhost:3005
LOG_LEVEL=info
```

**Frontend Service (bazi-frontend):**
```
VITE_API_URL=https://bazi-backend.render.com
VITE_APP_VERSION=2.1
VITE_ENABLE_AI_CONSULTANT=true
VITE_ENABLE_MATCHING=true
VITE_ENABLE_ARTICLES=true
VITE_ENABLE_ADMIN_PANEL=true
```

### 4. Render Git Integration

1. Go to Render Dashboard: https://dashboard.render.com
2. Select your service
3. Go to Settings → Git Integration
4. Ensure GitHub repository is connected
5. Set auto-deploy to "Yes" for main branch

## Workflow Execution

### Automatic Deployment (main branch)

1. Developer pushes code to main branch
2. GitHub Actions automatically triggers
3. Lint stage runs (warnings don't block)
4. Build stage runs (must succeed)
5. Test stage runs (failures don't block)
6. Deploy stage runs (only on main branch)
7. Health checks verify deployment
8. Notifications provided

### Pull Request Checks

1. Developer creates pull request
2. GitHub Actions automatically triggers
3. Lint stage runs
4. Build stage runs
5. Test stage runs
6. Results shown in PR checks
7. Deployment does NOT occur

### Manual Deployment

If automatic deployment doesn't work:

1. Go to Render Dashboard: https://dashboard.render.com
2. Select the service (bazi-backend or bazi-frontend)
3. Click "Manual Deploy" or "Redeploy"
4. Select the branch (main)
5. Click "Deploy"

## Monitoring Deployments

### GitHub Actions

1. Go to Repository → Actions tab
2. Click on the workflow run
3. View logs for each stage
4. Check for errors or warnings

### Render Dashboard

1. Go to https://dashboard.render.com
2. Select the service
3. View "Deployments" tab
4. Check deployment status and logs
5. View "Logs" tab for runtime logs

### Health Checks

The workflow performs health checks after deployment:

**Backend Health Check:**
```
GET https://bazi-backend.render.com/
Expected: 200 OK with JSON response
```

**Frontend Health Check:**
```
GET https://bazi-frontend.render.com/
Expected: 200 OK with HTML content
```

## Troubleshooting

### Deployment Fails at Lint Stage

**Issue:** ESLint errors in frontend code

**Solution:**
1. Check the error message in GitHub Actions logs
2. Fix the linting error locally
3. Run `npm run lint` in frontend directory
4. Commit and push the fix

**Example:**
```bash
cd frontend
npm run lint
# Fix errors shown
git add .
git commit -m "Fix linting errors"
git push origin main
```

### Deployment Fails at Build Stage

**Issue:** Frontend build fails or backend syntax error

**Solution:**
1. Check the error message in GitHub Actions logs
2. Reproduce locally:
   ```bash
   # Frontend
   cd frontend
   npm install
   npm run build
   
   # Backend
   cd backendjs
   npm install
   node -c server.js
   ```
3. Fix the error
4. Commit and push the fix

### Deployment Fails at Deploy Stage

**Issue:** Render deployment fails or health checks timeout

**Solution:**
1. Check Render dashboard logs: https://dashboard.render.com
2. Verify environment variables are set correctly
3. Check database connectivity
4. Review application logs for errors
5. If needed, manually rollback (see Rollback Procedures)

### Health Checks Timeout

**Issue:** Backend or frontend health check times out

**Solution:**
1. Check Render dashboard for deployment status
2. Wait a few minutes for deployment to complete
3. Manually verify:
   ```bash
   curl https://bazi-backend.render.com/
   curl https://bazi-frontend.render.com/
   ```
4. If still failing, check application logs in Render dashboard

### Tests Fail

**Issue:** Frontend or backend tests fail

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
3. Fix the failing tests
4. Commit and push the fix

## Rollback Procedures

### Automatic Rollback (if deployment fails)

The workflow provides manual rollback instructions when deployment fails.

### Manual Rollback Steps

1. **Identify the Issue**
   - Check Render dashboard logs
   - Review GitHub Actions logs
   - Check application error logs

2. **Rollback Backend**
   ```
   - Go to https://dashboard.render.com
   - Select 'bazi-backend' service
   - Click 'Deployments' tab
   - Find the previous successful deployment
   - Click 'Redeploy' to rollback
   ```

3. **Rollback Frontend**
   ```
   - Go to https://dashboard.render.com
   - Select 'bazi-frontend' service
   - Click 'Deployments' tab
   - Find the previous successful deployment
   - Click 'Redeploy' to rollback
   ```

4. **Rollback Database (if needed)**
   ```
   - Restore from SQLite backup
   - Update DATABASE_URL in Render environment
   - Redeploy backend service
   ```

5. **Verify Rollback**
   ```bash
   curl https://bazi-backend.render.com/
   curl https://bazi-frontend.render.com/
   ```

6. **Fix and Re-deploy**
   - Fix the issue in code
   - Push to main branch
   - GitHub Actions will trigger new deployment

## Best Practices

### 1. Commit Messages

Use clear, descriptive commit messages:
```
✓ Good:   "Fix CORS configuration for production"
✗ Bad:    "fix stuff"

✓ Good:   "Add health check endpoint"
✗ Bad:    "update"
```

### 2. Testing Before Push

Always test locally before pushing:
```bash
# Frontend
cd frontend
npm run lint
npm run build
npm test

# Backend
cd backendjs
npm install
node -c server.js
npm test
```

### 3. Pull Request Reviews

For significant changes, create a pull request:
1. Push to a feature branch
2. Create pull request to main
3. Wait for GitHub Actions checks to pass
4. Request code review
5. Merge after approval

### 4. Monitoring After Deployment

After deployment:
1. Check Render dashboard for errors
2. Verify application functionality
3. Monitor error logs for issues
4. Check performance metrics

### 5. Database Backups

Before major deployments:
1. Backup Supabase database
2. Keep SQLite backup for rollback
3. Document backup location and procedure

## Workflow Files

### deploy.yml

Main CI/CD workflow with 5 stages:
- Lint: Code quality checks
- Build: Frontend and backend builds
- Test: Unit and integration tests
- Deploy: Render deployment and health checks
- Rollback: Failure handling and instructions

**Triggers:** Push to main, pull requests

**Duration:** ~5-10 minutes

### lint.yml

Separate linting workflow for code quality:
- Frontend ESLint
- Backend syntax check
- Dependency security audit

**Triggers:** Push to main/develop, pull requests

**Duration:** ~2-3 minutes

## Monitoring and Alerts

### GitHub Actions Notifications

Enable notifications in GitHub:
1. Go to Settings → Notifications
2. Enable "Workflow runs"
3. Choose notification method (email, web, etc.)

### Render Notifications

Enable notifications in Render:
1. Go to Account Settings → Notifications
2. Enable deployment notifications
3. Choose notification method

### Manual Monitoring

Check status regularly:
1. GitHub Actions: https://github.com/[user]/[repo]/actions
2. Render Dashboard: https://dashboard.render.com
3. Application Logs: https://dashboard.render.com → Service → Logs

## Advanced Configuration

### Custom Deployment Hooks

To add custom deployment logic, edit `.github/workflows/deploy.yml`:

```yaml
- name: Custom Pre-Deployment Step
  run: |
    echo "Running custom pre-deployment checks"
    # Add your custom logic here
```

### Conditional Deployments

To deploy only on specific conditions:

```yaml
deploy:
  if: github.event_name == 'push' && github.ref == 'refs/heads/main' && contains(github.event.head_commit.message, '[deploy]')
```

### Slack Notifications

To add Slack notifications:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Deployment ${{ job.status }}"
      }
```

## Support and Resources

- GitHub Actions Documentation: https://docs.github.com/en/actions
- Render Documentation: https://render.com/docs
- Node.js Documentation: https://nodejs.org/docs
- Express Documentation: https://expressjs.com
- React Documentation: https://react.dev
- Vite Documentation: https://vitejs.dev

## Checklist for Deployment

Before deploying to production:

- [ ] All code changes reviewed and merged to main
- [ ] Linting checks pass (ESLint)
- [ ] Build completes successfully
- [ ] Tests pass (if configured)
- [ ] Environment variables configured in Render
- [ ] Database connectivity verified
- [ ] CORS whitelist configured
- [ ] Health checks configured
- [ ] Monitoring and alerting enabled
- [ ] Backup procedures documented
- [ ] Rollback procedures tested
- [ ] Team notified of deployment

## Frequently Asked Questions

**Q: How often does the workflow run?**
A: Every time code is pushed to main or a pull request is created.

**Q: Can I skip the deployment?**
A: Yes, by pushing to a different branch. Only main branch triggers deployment.

**Q: How do I manually trigger a deployment?**
A: Go to Render dashboard and click "Manual Deploy" or "Redeploy".

**Q: What if the health check fails?**
A: The workflow continues (doesn't block). Check Render logs for the actual issue.

**Q: Can I deploy without GitHub Actions?**
A: Yes, use Render's manual deploy feature in the dashboard.

**Q: How do I view deployment logs?**
A: Check GitHub Actions logs or Render dashboard logs.

**Q: What if I need to rollback?**
A: Use Render's "Redeploy" feature to rollback to a previous deployment.

**Q: How do I add environment variables?**
A: Go to Render dashboard → Service → Settings → Environment.

**Q: Can I deploy to staging first?**
A: Yes, create a separate Render service for staging and add a workflow for it.

**Q: How do I monitor the application after deployment?**
A: Check Render dashboard logs, GitHub Actions logs, and application health checks.

**Q: What if the database connection fails?**
A: Check DATABASE_URL environment variable and Supabase connectivity.
