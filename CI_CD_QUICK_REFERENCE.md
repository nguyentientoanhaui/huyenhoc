# CI/CD Quick Reference Card

## Workflow Status

Check GitHub Actions: https://github.com/[user]/[repo]/actions

## Common Tasks

### Deploy to Production
```bash
git add .
git commit -m "Your message"
git push origin main
# GitHub Actions will automatically deploy
```

### Check Deployment Status
1. GitHub Actions: https://github.com/[user]/[repo]/actions
2. Render Dashboard: https://dashboard.render.com
3. Application: https://bazi-backend.render.com/ and https://bazi-frontend.render.com/

### Rollback to Previous Version
1. Go to https://dashboard.render.com
2. Select service (bazi-backend or bazi-frontend)
3. Click "Deployments" tab
4. Find previous deployment
5. Click "Redeploy"

### View Logs
- GitHub Actions: https://github.com/[user]/[repo]/actions → Workflow → Job
- Render Backend: https://dashboard.render.com → bazi-backend → Logs
- Render Frontend: https://dashboard.render.com → bazi-frontend → Logs

### Fix Linting Errors
```bash
cd frontend
npm run lint
# Fix errors shown
git add .
git commit -m "Fix linting errors"
git push origin main
```

### Fix Build Errors
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

## Workflow Stages

| Stage | Duration | Purpose | Failure Action |
|-------|----------|---------|-----------------|
| Lint | 2 min | Code quality checks | Continue (warning) |
| Build | 3 min | Build frontend & backend | Stop (error) |
| Test | 2 min | Run test suites | Continue (warning) |
| Deploy | 5 min | Deploy to Render | Stop (error) |
| Rollback | - | Provide rollback instructions | Manual action |

## Environment Variables

### Backend (Render)
```
NODE_ENV=production
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
OPENROUTER_API_KEY=...
```

### Frontend (Render)
```
VITE_API_URL=https://bazi-backend.render.com
VITE_APP_VERSION=2.1
```

## Health Checks

```bash
# Backend
curl https://bazi-backend.render.com/
# Expected: JSON with status "running"

# Frontend
curl https://bazi-frontend.render.com/
# Expected: HTML content
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Lint errors | Run `npm run lint` locally and fix |
| Build fails | Check error in GitHub Actions logs |
| Deploy fails | Check Render logs for details |
| Health check fails | Wait a few minutes or check logs |
| Need to rollback | Go to Render dashboard → Deployments → Redeploy |

## Documentation

- **Setup**: CI_CD_SETUP_GUIDE.md
- **Troubleshooting**: CI_CD_TROUBLESHOOTING.md
- **Notifications**: DEPLOYMENT_NOTIFICATIONS.md
- **Rollback**: ROLLBACK_PROCEDURES.md
- **Summary**: CI_CD_IMPLEMENTATION_SUMMARY.md

## Useful Links

- GitHub Actions: https://github.com/[user]/[repo]/actions
- Render Dashboard: https://dashboard.render.com
- Backend API: https://bazi-backend.render.com/
- Frontend App: https://bazi-frontend.render.com/
- API Docs: https://bazi-backend.render.com/api/docs

## Before Pushing to Main

- [ ] Code reviewed
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm test`
- [ ] No console errors
- [ ] Tested locally

## After Deployment

- [ ] Check GitHub Actions status
- [ ] Verify Render deployment
- [ ] Test application functionality
- [ ] Check error logs
- [ ] Monitor performance

## Emergency Rollback

1. Go to https://dashboard.render.com
2. Select service
3. Click "Deployments"
4. Find previous deployment
5. Click "Redeploy"
6. Notify team

## Contact

- DevOps: [contact info]
- On-call: [contact info]
- Slack: #deployments

## Workflow Files

- `.github/workflows/deploy.yml` - Main CI/CD pipeline
- `.github/workflows/lint.yml` - Linting checks

## Key Metrics

- Lint time: ~2 minutes
- Build time: ~3 minutes
- Test time: ~2 minutes
- Deploy time: ~5 minutes
- Total time: ~12 minutes

## Success Criteria

✓ All stages pass
✓ Health checks pass
✓ No error messages
✓ Application responds
✓ Team notified

## Failure Criteria

✗ Lint errors (warning, continues)
✗ Build fails (stops)
✗ Tests fail (warning, continues)
✗ Deploy fails (stops)
✗ Health check fails (warning, continues)

## Notes

- Only main branch triggers deployment
- Pull requests run checks only
- Rollback available for all deployments
- Notifications sent on completion
- Logs available for 30 days
