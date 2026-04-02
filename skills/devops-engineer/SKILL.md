---
name: devops-engineer
description: DevOps and deployment for desenrollalo-site project. Specialized in CI/CD pipelines, GitHub Actions, auto-deployment, health monitoring, and performance optimization. Use when: setting up GitHub Actions workflow, configuring auto-deploy to GitHub Pages, implementing health checks, monitoring performance metrics, or optimizing build/deploy processes.
---

# DevOps Engineer Skill

## Context

You're managing deployment and infrastructure for **desenrollalo-site** - a static site hosted on GitHub Pages. Your role is to ensure reliable, automated deployments with monitoring and performance optimization.

## Architecture

### Deployment Pipeline
```
Local Development → GitHub Push → GitHub Actions → GitHub Pages
```

### Technology Stack
- **Hosting**: GitHub Pages (static)
- **CI/CD**: GitHub Actions
- **Source Control**: Git
- **Monitoring**: Uptime checks, error tracking

## Implementation Tasks

### Task 1: GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:  # Manual trigger

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Build validation
        run: |
          # Validate HTML structure
          if [ -f "index.html" ]; then
            echo "✓ index.html exists"
          else
            echo "✗ index.html missing"
            exit 1
          fi
          
          # Check for critical files
          REQUIRED_FILES=("style.css" "app.js")
          for file in "${REQUIRED_FILES[@]}"; do
            if [ -f "$file" ]; then
              echo "✓ $file exists"
            else
              echo "✗ $file missing"
              exit 1
            fi
          done
          
          # Basic HTML validation (no broken tags)
          if grep -q "</html>" index.html; then
            echo "✓ HTML structure valid"
          else
            echo "✗ HTML structure invalid"
            exit 1
          fi
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Task 2: Health Monitoring
Create `health-check.js`:

```javascript
// Health check script for monitoring
const HEALTH_CHECKS = {
  'index.html': {
    url: '/',
    expectedStatus: 200,
    contentType: 'text/html'
  },
  'style.css': {
    url: '/style.css',
    expectedStatus: 200,
    contentType: 'text/css'
  },
  'app.js': {
    url: '/app.js',
    expectedStatus: 200,
    contentType: 'application/javascript'
  }
};

async function runHealthCheck() {
  const baseUrl = window.location.origin;
  const results = [];
  
  for (const [name, check] of Object.entries(HEALTH_CHECKS)) {
    try {
      const response = await fetch(baseUrl + check.url);
      const passed = response.status === check.expectedStatus;
      
      results.push({
        name,
        passed,
        status: response.status,
        contentType: response.headers.get('content-type')
      });
    } catch (error) {
      results.push({
        name,
        passed: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// Export for testing
if (typeof module !== 'undefined') {
  module.exports = { runHealthCheck };
}
```

### Task 3: Performance Optimization
**Optimization checklist**:
- [ ] Minify CSS and JS (optional for small files)
- [ ] Optimize images (if any)
- [ ] Enable Gzip compression (GitHub Pages does this)
- [ ] Set cache headers
- [ ] Remove unused CSS/JS

**Cache control** (add to `.htaccess` if using custom domain):
```
# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
  Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Cache HTML for shorter time
<FilesMatch "\.(html|htm)$">
  Header set Cache-Control "public, max-age=3600"
</FilesMatch>
```

### Task 4: Error Tracking
Add error tracking to `app.js`:

```javascript
// Error tracking
function trackError(error, context = {}) {
  const errorData = {
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Log to console
  console.error('Application Error:', errorData);
  
  // Send to analytics (if configured)
  if (window.ga) {
    window.ga('send', 'event', 'Error', error.message, context);
  }
  
  // Store locally for debugging
  const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
  errors.push(errorData);
  localStorage.setItem('app_errors', JSON.stringify(errors.slice(-10))); // Keep last 10
}

// Global error handler
window.addEventListener('error', (event) => {
  trackError(event.error, {
    type: 'global',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  trackError(event.reason, {
    type: 'promise',
    promise: event.promise
  });
});
```

## Deployment Process

### Pre-deployment Checklist
1. [ ] All tests passing (QA verified)
2. [ ] No console errors
3. [ ] Responsive design verified
4. [ ] Cross-browser compatibility
5. [ ] Performance metrics acceptable
6. [ ] Documentation updated

### Deployment Steps
1. **Merge to main**: After PR approval
2. **Auto-trigger**: GitHub Actions runs on push
3. **Build validation**: Check required files
4. **Deploy**: Auto-deploy to GitHub Pages
5. **Verify**: Health check passes
6. **Monitor**: Watch for errors 24h

### Rollback Procedure
If deployment fails:
1. Revert to previous commit
2. Manual deploy via GitHub UI if needed
3. Investigate failure cause
4. Fix and redeploy

## Monitoring & Alerts

### Uptime Monitoring
**Tools**:
- GitHub Pages status page
- External uptime monitor (optional)
- Custom health check endpoint

**Metrics to track**:
- Response time < 2s
- Uptime > 99.9%
- Error rate < 1%

### Performance Monitoring
**Lighthouse scores** (target):
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Error Monitoring
- JavaScript console errors
- Network request failures
- User-reported issues

## Security Considerations

### Content Security Policy
Add to `index.html` if needed:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;">
```

### Security Headers
GitHub Pages provides:
- HTTPS enforced
- HSTS enabled
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

## Cost Optimization

### GitHub Pages
- Free for public repos
- 1GB storage limit
- 100GB bandwidth/month

### Monitoring Costs
- Use free tier services
- GitHub Actions: 2000 minutes/month free
- Custom domain: Optional ($)

## Success Metrics

### Deployment Metrics
- ✅ Deploy time < 5 minutes
- ✅ Success rate > 99%
- ✅ Rollback time < 10 minutes
- ✅ Zero-downtime deployments

### Performance Metrics
- ✅ Load time < 3s
- ✅ Time to interactive < 5s
- ✅ Lighthouse scores met
- ✅ Error rate < 0.1%

### Reliability Metrics
- ✅ Uptime > 99.9%
- ✅ Health checks passing
- ✅ No security vulnerabilities
- ✅ Backup strategy in place

## Documentation

### Runbook
Create `DEPLOYMENT.md`:
```markdown
# Deployment Runbook

## Quick Deploy
1. Push to main branch
2. Monitor GitHub Actions
3. Verify at https://sergioquez.github.io/desenrollalo-site/

## Manual Deploy
1. Go to Repository Settings → Pages
2. Select branch: main
3. Click Save

## Troubleshooting
- Check GitHub Actions logs
- Verify file structure
- Test health check endpoint
```

### Incident Response
- Document common issues
- Create troubleshooting guide
- Establish escalation path