# Deployment Notifications Setup

## Overview

This guide explains how to set up notifications for CI/CD deployments. Notifications keep your team informed about deployment status, failures, and issues.

## Notification Types

### 1. GitHub Actions Notifications

**What:** Notifications about workflow runs (success/failure)

**How to Enable:**

1. Go to GitHub Settings:
   - Click your profile icon → Settings
   - Click "Notifications" in left sidebar

2. Configure notification preferences:
   - Select "Participating and @mentions" or "All Activity"
   - Choose notification method:
     - Email
     - Web notifications
     - Mobile app

3. Repository-specific settings:
   - Go to Repository → Settings → Notifications
   - Choose notification level

**When You'll Get Notified:**
- Workflow run completes (success or failure)
- Workflow run is queued
- Workflow run is in progress (optional)

**Example Notification:**
```
[Repository] Workflow "CI/CD - Build and Deploy to Render" completed
Status: Failed
Branch: main
Commit: abc123def456
```

### 2. Render Notifications

**What:** Notifications about deployments and service status

**How to Enable:**

1. Go to Render Dashboard:
   - https://dashboard.render.com

2. Click Account Settings (bottom left):
   - Click your email/profile
   - Select "Account Settings"

3. Go to "Notifications" section:
   - Enable "Deployment notifications"
   - Enable "Service alerts"
   - Choose notification method:
     - Email
     - Slack (if connected)
     - PagerDuty (if connected)

4. Service-specific settings:
   - Go to Service → Settings
   - Enable "Notify on deployment"
   - Enable "Notify on failure"

**When You'll Get Notified:**
- Deployment starts
- Deployment succeeds
- Deployment fails
- Service goes down
- Service recovers

**Example Notification:**
```
Deployment of bazi-backend succeeded
Deployed at: 2024-01-15 10:30:00 UTC
Commit: abc123def456
Duration: 2 minutes 30 seconds
```

### 3. Email Notifications

**GitHub Email:**
- Sent to your GitHub email address
- Configurable in GitHub Settings

**Render Email:**
- Sent to your Render account email
- Configurable in Render Account Settings

### 4. Slack Notifications (Optional)

**Setup:**

1. Create a Slack workspace or use existing one
2. Create a channel for deployments:
   - Click "+" next to "Channels"
   - Name: `#deployments` or `#ci-cd`
   - Make it private or public

3. Add GitHub integration:
   - Go to GitHub Repository → Settings → Integrations
   - Click "Add integration"
   - Search for "Slack"
   - Follow setup instructions
   - Select channel: `#deployments`

4. Add Render integration:
   - Go to Render Account Settings → Integrations
   - Click "Connect Slack"
   - Authorize Render app
   - Select channel: `#deployments`

**Example Slack Message:**
```
🚀 Deployment Started
Repository: tinix-bazi
Branch: main
Commit: abc123def456 - Fix CORS configuration
Author: developer@example.com
```

### 5. Custom Notifications (Advanced)

**Using GitHub Actions Webhooks:**

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Send Custom Notification
  if: always()
  run: |
    STATUS="${{ job.status }}"
    WEBHOOK_URL="${{ secrets.WEBHOOK_URL }}"
    
    curl -X POST "$WEBHOOK_URL" \
      -H "Content-Type: application/json" \
      -d "{
        \"status\": \"$STATUS\",
        \"repository\": \"${{ github.repository }}\",
        \"branch\": \"${{ github.ref }}\",
        \"commit\": \"${{ github.sha }}\",
        \"author\": \"${{ github.actor }}\",
        \"timestamp\": \"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\"
      }"
```

**Using Discord Webhook:**

```yaml
- name: Notify Discord
  if: always()
  run: |
    curl -X POST "${{ secrets.DISCORD_WEBHOOK }}" \
      -H "Content-Type: application/json" \
      -d "{
        \"content\": \"Deployment ${{ job.status }}\",
        \"embeds\": [{
          \"title\": \"Deployment Status\",
          \"description\": \"Repository: ${{ github.repository }}\",
          \"color\": $([ \"${{ job.status }}\" = \"success\" ] && echo \"65280\" || echo \"16711680\")
        }]
      }"
```

## Notification Configuration

### GitHub Actions Workflow Notifications

**Email Notifications:**
- Sent to: Your GitHub email
- Frequency: Immediate
- Customizable: Yes (in GitHub Settings)

**Web Notifications:**
- Sent to: GitHub notification center
- Frequency: Immediate
- Customizable: Yes (in GitHub Settings)

### Render Dashboard Notifications

**Email Notifications:**
- Sent to: Your Render account email
- Frequency: Immediate
- Customizable: Yes (in Render Account Settings)

**In-Dashboard Notifications:**
- Shown in: Render dashboard
- Frequency: Real-time
- Customizable: Yes (in Render Account Settings)

## Notification Content

### Successful Deployment

**GitHub Actions:**
```
✓ Workflow "CI/CD - Build and Deploy to Render" completed successfully
Repository: tinix-bazi
Branch: main
Commit: abc123def456
Message: Fix CORS configuration for production
Author: developer@example.com
Duration: 5 minutes 30 seconds
```

**Render:**
```
✓ Deployment of bazi-backend succeeded
Deployed at: 2024-01-15 10:30:00 UTC
Commit: abc123def456
Duration: 2 minutes 30 seconds
Health check: Passed
```

### Failed Deployment

**GitHub Actions:**
```
✗ Workflow "CI/CD - Build and Deploy to Render" failed
Repository: tinix-bazi
Branch: main
Commit: abc123def456
Failed stage: Build
Error: Frontend build failed - missing dependency
Author: developer@example.com
```

**Render:**
```
✗ Deployment of bazi-backend failed
Failed at: 2024-01-15 10:30:00 UTC
Commit: abc123def456
Error: Database connection failed
Health check: Failed
```

## Best Practices

### 1. Notification Channels

**For Development Team:**
- Use Slack for real-time notifications
- Use email for important failures
- Use GitHub for code review notifications

**For Operations Team:**
- Use Render dashboard for monitoring
- Use email for critical failures
- Use PagerDuty for on-call alerts

**For Management:**
- Use email for deployment summaries
- Use dashboard for status overview

### 2. Notification Frequency

**Too Many Notifications:**
- Disable non-critical notifications
- Use digest emails instead of immediate
- Filter by branch (main only)

**Too Few Notifications:**
- Enable failure notifications
- Enable health check failures
- Enable service alerts

### 3. Notification Timing

**Best Times:**
- During business hours for non-critical
- Immediately for critical failures
- Scheduled for non-urgent updates

**Avoid:**
- Notifications during off-hours (unless critical)
- Duplicate notifications from multiple sources
- Notifications for expected failures

### 4. Notification Content

**Include:**
- Status (success/failure)
- Repository and branch
- Commit hash and message
- Author and timestamp
- Error details (if failed)
- Link to logs

**Avoid:**
- Sensitive information (API keys, passwords)
- Verbose error traces (link to logs instead)
- Unnecessary details

## Troubleshooting Notifications

### Issue 1: Not Receiving Notifications

**Solution:**

1. Check GitHub Settings:
   - Settings → Notifications
   - Verify notifications are enabled
   - Check email address is correct

2. Check Render Settings:
   - Account Settings → Notifications
   - Verify notifications are enabled
   - Check email address is correct

3. Check email spam folder:
   - Notifications might be filtered
   - Add GitHub/Render to contacts

4. Check notification permissions:
   - Repository Settings → Notifications
   - Verify you have permission to receive notifications

### Issue 2: Too Many Notifications

**Solution:**

1. Reduce notification frequency:
   - GitHub Settings → Notifications
   - Select "Participating and @mentions"
   - Disable "All Activity"

2. Filter by branch:
   - Only enable for main branch
   - Disable for feature branches

3. Use digest emails:
   - GitHub Settings → Notifications
   - Select "Email digest"

4. Disable non-critical notifications:
   - Disable "Workflow run" notifications
   - Keep only "Failure" notifications

### Issue 3: Missing Deployment Notifications

**Solution:**

1. Verify Render integration:
   - Render Account Settings → Integrations
   - Check if Slack/email is connected

2. Check notification settings:
   - Render Account Settings → Notifications
   - Verify "Deployment notifications" is enabled

3. Check service settings:
   - Service → Settings → Notifications
   - Verify notifications are enabled

4. Check webhook configuration:
   - Verify webhook URL is correct
   - Test webhook manually

## Notification Examples

### Example 1: Successful Deployment Email

```
Subject: ✓ Deployment Successful - tinix-bazi

From: GitHub Actions <noreply@github.com>

Workflow: CI/CD - Build and Deploy to Render
Status: ✓ Success
Repository: tinix-bazi
Branch: main
Commit: abc123def456
Message: Fix CORS configuration for production
Author: developer@example.com
Duration: 5 minutes 30 seconds

View workflow: https://github.com/user/tinix-bazi/actions/runs/12345

---

Deployment Details:
- Lint: ✓ Passed
- Build: ✓ Passed
- Test: ✓ Passed
- Deploy: ✓ Passed
- Health Check: ✓ Passed

Application URLs:
- Frontend: https://bazi-frontend.render.com
- Backend: https://bazi-backend.render.com
```

### Example 2: Failed Deployment Email

```
Subject: ✗ Deployment Failed - tinix-bazi

From: GitHub Actions <noreply@github.com>

Workflow: CI/CD - Build and Deploy to Render
Status: ✗ Failed
Repository: tinix-bazi
Branch: main
Commit: abc123def456
Message: Add new API endpoint
Author: developer@example.com

View workflow: https://github.com/user/tinix-bazi/actions/runs/12345

---

Failed Stage: Build
Error: Frontend build failed

Error Details:
vite build failed
Error: Cannot find module 'react-router-dom'

Solution:
1. Check frontend/package.json for missing dependencies
2. Run: npm install
3. Commit and push to main branch
4. GitHub Actions will retry automatically

---

Rollback Instructions:
If needed, rollback to previous deployment:
1. Go to https://dashboard.render.com
2. Select the service
3. Click "Deployments" tab
4. Find the previous successful deployment
5. Click "Redeploy"
```

### Example 3: Slack Notification

```
🚀 Deployment Started
Repository: tinix-bazi
Branch: main
Commit: abc123def456
Message: Fix CORS configuration for production
Author: developer@example.com
Time: 2024-01-15 10:25:00 UTC

---

✓ Lint: Passed
✓ Build: Passed
✓ Test: Passed
🔄 Deploy: In Progress...

View: https://github.com/user/tinix-bazi/actions/runs/12345
```

## Notification Workflow

### Typical Deployment Notification Flow

```
1. Developer pushes to main
   ↓
2. GitHub Actions triggered
   ↓
3. Lint stage starts
   ↓
4. Build stage starts
   ↓
5. Test stage starts
   ↓
6. Deploy stage starts
   ↓
7. Render deployment triggered
   ↓
8. Health checks run
   ↓
9. Deployment completes
   ↓
10. Notifications sent to team
```

### Notification Timeline

```
T+0:00   - Developer pushes code
T+0:05   - GitHub Actions starts (notification sent)
T+2:00   - Build completes (notification sent)
T+3:00   - Tests complete (notification sent)
T+4:00   - Deploy starts (notification sent)
T+6:00   - Health checks pass (notification sent)
T+6:30   - Deployment complete (notification sent)
```

## Monitoring Dashboard

### GitHub Actions Dashboard

- URL: https://github.com/[user]/[repo]/actions
- Shows: All workflow runs
- Updates: Real-time
- Notifications: Configurable

### Render Dashboard

- URL: https://dashboard.render.com
- Shows: Deployment status, logs, metrics
- Updates: Real-time
- Notifications: Configurable

### Application Monitoring

- URL: https://bazi-backend.render.com/
- Shows: Health check status
- Updates: Real-time
- Notifications: Via Render

## Notification Checklist

Before going to production:

- [ ] GitHub Actions notifications enabled
- [ ] Render notifications enabled
- [ ] Email address verified
- [ ] Slack integration configured (optional)
- [ ] Team members added to notifications
- [ ] Notification preferences set
- [ ] Test notifications working
- [ ] Rollback procedures documented
- [ ] On-call schedule configured
- [ ] Escalation procedures defined

## Support and Resources

- GitHub Notifications: https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github
- Render Notifications: https://render.com/docs/notifications
- Slack Integration: https://slack.com/apps
- Discord Webhooks: https://discord.com/developers/docs/resources/webhook
