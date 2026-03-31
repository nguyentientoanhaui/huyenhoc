# GitHub Actions Workflows

This directory contains the CI/CD workflows for the BaZi application deployment to Render.

## Workflows

### 1. deploy.yml - Main CI/CD Pipeline

**Purpose:** Automated build, test, and deployment to Render

**Triggers:**
- Push to main branch (triggers deployment)
- Pull requests (runs checks only)

**Stages:**
1. **Lint** - Code quality checks (ESLint, syntax)
2. **Build** - Build frontend and backend
3. **Test** - Run test suites
4. **Deploy** - Deploy to Render (main branch only)
5. **Rollback** - Provide rollback instructions on failure

**Duration:** ~5-10 minutes

**Status Badge:**
```markdown
![CI/CD Status](https://github.com/[user]/[repo]/actions/workflows/deploy.yml/badge.svg)
```

### 2. lint.yml - Linting and Code Quality

**Purpose:** Dedicated linting and dependency security checks

**Triggers:**
- Push to main/develop branches
- Pull requests

**Stages:**
1. **Frontend Linting** - ESLint checks
2. **Backend Syntax** - Node.js syntax validation
3. **Dependency Check** - npm audit

**Duration:** ~2-3 minutes

**Status Badge:**
```markdown
![Lint Status](https://github.com/[user]/[repo]/actions/workflows/lint.yml/badge.svg)
```

## Workflow Configuration

### Environment Variables

The workflows use the following environment variables:

```yaml
NODE_VERSION: '18'
```

### Caching

Dependencies are cached to speed up builds:
- npm cache is used for faster dependency installation
- Cache is automatically managed by GitHub Actions

### Artifacts

Build artifacts are uploaded and retained for 1 day:
- Frontend dist directory
- Used for deployment verification

## Monitoring Workflows

### GitHub Actions Dashboard

View all workflow runs:
```
https://github.com/[user]/[repo]/actions
```

### Workflow Run Details

Click on a workflow run to see:
- Job status (success/failure)
- Step-by-step logs
- Execution time
- Artifacts

### Workflow Logs

Each job produces detailed logs:
- Lint stage logs
- Build stage logs
- Test stage logs
- Deploy stage logs
- Rollback stage logs

## Troubleshooting

### Workflow Not Triggering

1. Check workflow file syntax (YAML)
2. Verify workflow is in `.github/workflows/` directory
3. Check branch name (main for deploy)
4. Verify GitHub Actions is enabled

### Workflow Fails

1. Check the failed job logs
2. Review the error message
3. Fix the issue locally
4. Push to main branch
5. Workflow will retry automatically

### Slow Workflow

1. Check for large dependencies
2. Verify cache is working
3. Consider parallel jobs
4. Optimize build process

## Customization

### Adding New Steps

Edit the workflow file and add a new step:

```yaml
- name: Custom Step
  run: |
    echo "Running custom step"
    # Add your commands here
```

### Changing Triggers

Modify the `on:` section:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
```

### Adding Notifications

Add a notification step:

```yaml
- name: Notify Slack
  if: always()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -d "Deployment ${{ job.status }}"
```

## Best Practices

1. **Keep Workflows Simple**
   - One workflow per concern
   - Clear, descriptive step names
   - Proper error handling

2. **Use Caching**
   - Cache dependencies
   - Cache build artifacts
   - Reduce build time

3. **Parallel Jobs**
   - Run independent jobs in parallel
   - Reduce total workflow time
   - Use job dependencies

4. **Error Handling**
   - Use `continue-on-error` for non-critical steps
   - Provide clear error messages
   - Include troubleshooting links

5. **Security**
   - Use GitHub Secrets for sensitive data
   - Don't print secrets in logs
   - Validate inputs
   - Use trusted actions

## Workflow Files

### deploy.yml Structure

```yaml
name: CI/CD - Build and Deploy to Render

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  lint:
    # Linting stage
  build:
    # Build stage
  test:
    # Test stage
  deploy:
    # Deploy stage
  rollback:
    # Rollback stage
```

### lint.yml Structure

```yaml
name: Linting and Code Quality

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'

jobs:
  frontend-lint:
    # Frontend linting
  backend-syntax:
    # Backend syntax check
  dependency-check:
    # Dependency security check
```

## Integration with Render

The workflows integrate with Render through:

1. **Git Integration**
   - Render detects Git changes
   - Automatically triggers deployment
   - Uses render.yaml for configuration

2. **Environment Variables**
   - Render provides environment variables
   - Workflows use them for deployment
   - Secrets stored in Render dashboard

3. **Health Checks**
   - Workflows verify deployment health
   - Check backend and frontend
   - Provide status and next steps

## Integration with GitHub

The workflows integrate with GitHub through:

1. **Status Checks**
   - Show workflow status in PR
   - Block merge if checks fail
   - Provide detailed logs

2. **Notifications**
   - Email notifications
   - Web notifications
   - Mobile app notifications

3. **Secrets**
   - Store sensitive data
   - Use in workflows
   - Automatically masked in logs

## Maintenance

### Regular Updates

- Update Node.js version when needed
- Update action versions
- Review and update dependencies
- Test workflow changes

### Monitoring

- Check workflow execution times
- Monitor failure rates
- Review logs for issues
- Optimize performance

### Documentation

- Keep README updated
- Document custom steps
- Provide troubleshooting guide
- Share best practices

## Support

For issues or questions:

1. Check GitHub Actions documentation
2. Review workflow logs
3. Check troubleshooting guide
4. Contact DevOps team

## Resources

- GitHub Actions: https://docs.github.com/en/actions
- Workflow Syntax: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- Render Integration: https://render.com/docs/github
- Node.js: https://nodejs.org/docs
