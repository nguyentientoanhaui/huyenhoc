# CI/CD Documentation Index

## Quick Navigation

### For First-Time Setup
1. Start here: [CI/CD Setup Guide](CI_CD_SETUP_GUIDE.md)
2. Configure: [Environment Variables](#environment-variables)
3. Test: [Verify Deployment](#verify-deployment)

### For Daily Operations
1. Quick reference: [CI/CD Quick Reference](CI_CD_QUICK_REFERENCE.md)
2. Deploy: [How to Deploy](#how-to-deploy)
3. Monitor: [Monitoring](#monitoring)

### For Troubleshooting
1. Quick diagnosis: [CI/CD Troubleshooting](CI_CD_TROUBLESHOOTING.md)
2. Common issues: [Common Issues](#common-issues)
3. Emergency: [Emergency Procedures](#emergency-procedures)

### For Advanced Topics
1. Notifications: [Deployment Notifications](DEPLOYMENT_NOTIFICATIONS.md)
2. Rollback: [Rollback Procedures](ROLLBACK_PROCEDURES.md)
3. Workflows: [.github/workflows/README.md](.github/workflows/README.md)

## Documentation Files

### Core Documentation

| File | Purpose | Audience |
|------|---------|----------|
| [CI_CD_SETUP_GUIDE.md](CI_CD_SETUP_GUIDE.md) | Complete setup and configuration guide | DevOps, Developers |
| [CI_CD_TROUBLESHOOTING.md](CI_CD_TROUBLESHOOTING.md) | Troubleshooting common issues | Developers, DevOps |
| [CI_CD_QUICK_REFERENCE.md](CI_CD_QUICK_REFERENCE.md) | Quick reference card | All team members |
| [CI_CD_IMPLEMENTATION_SUMMARY.md](CI_CD_IMPLEMENTATION_SUMMARY.md) | Implementation overview | Project managers, DevOps |
| [CI_CD_INDEX.md](CI_CD_INDEX.md) | This file - documentation index | All team members |

### Advanced Documentation

| File | Purpose | Audience |
|------|---------|----------|
| [DEPLOYMENT_NOTIFICATIONS.md](DEPLOYMENT_NOTIFICATIONS.md) | Notification setup and configuration | DevOps, Team leads |
| [ROLLBACK_PROCEDURES.md](ROLLBACK_PROCEDURES.md) | Rollback procedures and recovery | DevOps, On-call engineers |
| [.github/workflows/README.md](.github/workflows/README.md) | Workflow file documentation | Developers, DevOps |

### Related Documentation

| File | Purpose |
|------|---------|
| [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) | Render deployment setup |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Pre-deployment checklist |
| [FRONTEND_CONFIG_GUIDE.md](FRONTEND_CONFIG_GUIDE.md) | Frontend configuration |
| [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) | Database migration guide |

## Workflow Files

### GitHub Actions Workflows

| File | Purpose | Triggers |
|------|---------|----------|
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) | Main CI/CD pipeline | Push to main, PRs |
| [.github/workflows/lint.yml](.github/workflows/lint.yml) | Linting and code quality | Push to main/develop, PRs |

## How to Deploy

### Step 1: Prepare Code
```bash
# Make your changes
git add .
git commit -m "Your message"
```

### Step 2: Push to Main
```bash
git push origin main
```

### Step 3: Monitor Deployment
- GitHub Actions: https://github.com/[user]/[repo]/actions
- Render Dashboard: https://dashboard.render.com

### Step 4: Verify
```bash
curl https://bazi-backend.render.com/
curl https://bazi-frontend.render.com/
```

## Environment Variables

### Backend (Render Dashboard)
```
NODE_ENV=production
TZ=Asia/Ho_Chi_Minh
PORT=8888
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
OPENROUTER_API_KEY=...
CORS_ORIGIN=https://bazi-frontend.render.com,http://localhost:3005
LOG_LEVEL=info
```

### Frontend (Render Dashboard)
```
VITE_API_URL=https://bazi-backend.render.com
VITE_APP_VERSION=2.1
VITE_ENABLE_AI_CONSULTANT=true
VITE_ENABLE_MATCHING=true
VITE_ENABLE_ARTICLES=true
VITE_ENABLE_ADMIN_PANEL=true
```

## Monitoring

### GitHub Actions
- URL: https://github.com/[user]/[repo]/actions
- Shows: Workflow runs, logs, status
- Notifications: Email, web, mobile

### Render Dashboard
- URL: https://dashboard.render.com
- Shows: Deployments, logs, metrics
- Notifications: Email, Slack, PagerDuty

### Application Health
- Backend: https://bazi-backend.render.com/
- Frontend: https://bazi-frontend.render.com/
- API Docs: https://bazi-backend.render.com/api/docs

## Common Issues

### Lint Errors
**Problem:** ESLint errors in frontend code
**Solution:** See [CI_CD_TROUBLESHOOTING.md](CI_CD_TROUBLESHOOTING.md) → Issue 1

### Build Fails
**Problem:** Frontend or backend build fails
**Solution:** See [CI_CD_TROUBLESHOOTING.md](CI_CD_TROUBLESHOOTING.md) → Issue 2-3

### Deploy Fails
**Problem:** Render deployment fails
**Solution:** See [CI_CD_TROUBLESHOOTING.md](CI_CD_TROUBLESHOOTING.md) → Issue 4

### Health Check Fails
**Problem:** Backend or frontend not responding
**Solution:** See [CI_CD_TROUBLESHOOTING.md](CI_CD_TROUBLESHOOTING.md) → Issue 5-6

### Tests Fail
**Problem:** Unit or integration tests fail
**Solution:** See [CI_CD_TROUBLESHOOTING.md](CI_CD_TROUBLESHOOTING.md) → Issue 7

### Workflow Not Triggering
**Problem:** GitHub Actions workflow doesn't run
**Solution:** See [CI_CD_TROUBLESHOOTING.md](CI_CD_TROUBLESHOOTING.md) → Issue 8

### Application Not Working
**Problem:** Deployment succeeds but app doesn't work
**Solution:** See [CI_CD_TROUBLESHOOTING.md](CI_CD_TROUBLESHOOTING.md) → Issue 9

## Emergency Procedures

### Immediate Rollback
1. Go to https://dashboard.render.com
2. Select service (bazi-backend or bazi-frontend)
3. Click "Deployments" tab
4. Find previous deployment
5. Click "Redeploy"

See [ROLLBACK_PROCEDURES.md](ROLLBACK_PROCEDURES.md) for detailed procedures.

### Service Down
1. Check Render dashboard for errors
2. Check GitHub Actions logs
3. Check application logs
4. Rollback if needed
5. Notify team

### Database Issues
1. Check Supabase dashboard
2. Verify DATABASE_URL
3. Check connection logs
4. Restore from backup if needed

See [ROLLBACK_PROCEDURES.md](ROLLBACK_PROCEDURES.md) → Procedure 4

## Workflow Stages

### Lint Stage (2 min)
- ESLint for frontend
- Syntax check for backend
- Continues on error

### Build Stage (3 min)
- Build frontend with Vite
- Verify backend
- Upload artifacts

### Test Stage (2 min)
- Frontend tests (if configured)
- Backend tests (if configured)
- Continues on error

### Deploy Stage (5 min)
- Trigger Render deployment
- Wait for deployment
- Health checks
- Notifications

### Rollback Stage (on failure)
- Provide rollback instructions
- Document investigation steps
- Explain re-deployment

## Useful Commands

### Local Testing
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

### Health Checks
```bash
curl https://bazi-backend.render.com/
curl https://bazi-frontend.render.com/
```

### View Logs
```bash
# GitHub Actions
https://github.com/[user]/[repo]/actions

# Render Backend
https://dashboard.render.com → bazi-backend → Logs

# Render Frontend
https://dashboard.render.com → bazi-frontend → Logs
```

## Useful Links

### GitHub
- Repository: https://github.com/[user]/[repo]
- Actions: https://github.com/[user]/[repo]/actions
- Commits: https://github.com/[user]/[repo]/commits/main
- Settings: https://github.com/[user]/[repo]/settings

### Render
- Dashboard: https://dashboard.render.com
- Backend Service: https://dashboard.render.com → bazi-backend
- Frontend Service: https://dashboard.render.com → bazi-frontend
- Deployments: https://dashboard.render.com → Service → Deployments

### Application
- Backend API: https://bazi-backend.render.com/
- Frontend App: https://bazi-frontend.render.com/
- API Docs: https://bazi-backend.render.com/api/docs

### Documentation
- GitHub Actions: https://docs.github.com/en/actions
- Render Docs: https://render.com/docs
- Node.js: https://nodejs.org/docs
- Express: https://expressjs.com
- React: https://react.dev
- Vite: https://vitejs.dev

## Team Roles

### Developer
- Pushes code to main branch
- Monitors GitHub Actions
- Fixes failing tests/linting
- Verifies deployment

### DevOps Engineer
- Configures environment variables
- Sets up notifications
- Monitors deployments
- Handles rollbacks

### Team Lead
- Reviews deployment status
- Approves deployments
- Handles escalations
- Communicates with team

### On-Call Engineer
- Responds to deployment failures
- Performs rollbacks
- Investigates issues
- Communicates status

## Checklist for New Team Members

- [ ] Read CI/CD Quick Reference
- [ ] Read CI/CD Setup Guide
- [ ] Access GitHub repository
- [ ] Access Render dashboard
- [ ] Configure local environment
- [ ] Test local build
- [ ] Make test deployment
- [ ] Review troubleshooting guide
- [ ] Review rollback procedures
- [ ] Ask questions

## Support

### Getting Help

1. **Check Documentation**
   - Quick Reference: [CI_CD_QUICK_REFERENCE.md](CI_CD_QUICK_REFERENCE.md)
   - Troubleshooting: [CI_CD_TROUBLESHOOTING.md](CI_CD_TROUBLESHOOTING.md)
   - Setup Guide: [CI_CD_SETUP_GUIDE.md](CI_CD_SETUP_GUIDE.md)

2. **Check Logs**
   - GitHub Actions: https://github.com/[user]/[repo]/actions
   - Render: https://dashboard.render.com

3. **Contact Team**
   - DevOps: [contact info]
   - On-call: [contact info]
   - Slack: #deployments

## Frequently Asked Questions

**Q: How often does the workflow run?**
A: Every time code is pushed to main or a PR is created.

**Q: Can I skip the deployment?**
A: Yes, push to a different branch. Only main triggers deployment.

**Q: How do I manually deploy?**
A: Go to Render dashboard and click "Manual Deploy".

**Q: What if the health check fails?**
A: The workflow continues. Check Render logs for the actual issue.

**Q: How do I rollback?**
A: Go to Render dashboard → Deployments → Redeploy previous version.

**Q: How do I view deployment logs?**
A: GitHub Actions logs or Render dashboard logs.

**Q: Can I deploy to staging first?**
A: Yes, create a separate Render service for staging.

**Q: How do I add environment variables?**
A: Go to Render dashboard → Service → Settings → Environment.

**Q: What if the database connection fails?**
A: Check DATABASE_URL and Supabase connectivity.

**Q: How do I monitor the application?**
A: Check Render dashboard logs and GitHub Actions logs.

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-15 | Initial implementation |

## Document Information

- **Created:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Status:** Active
- **Audience:** All team members
- **Maintainer:** DevOps Team

## Next Steps

1. Review [CI_CD_SETUP_GUIDE.md](CI_CD_SETUP_GUIDE.md)
2. Configure environment variables
3. Test the workflow
4. Set up notifications
5. Train team members

---

For questions or updates, contact the DevOps team.
