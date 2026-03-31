# Frontend Configuration Guide

## Overview

This guide explains how to configure the React frontend for different environments (development, staging, production).

## Environment Files

The frontend uses Vite's environment variable system. Create `.env` files in the `frontend/` directory:

### Development Environment (`.env.development`)

```env
VITE_API_URL=http://localhost:8888
VITE_API_TIMEOUT=30000
VITE_APP_NAME=BaZi Mega-Evolution
VITE_APP_VERSION=2.1
VITE_ENABLE_AI_CONSULTANT=true
VITE_ENABLE_MATCHING=true
VITE_ENABLE_ARTICLES=true
VITE_ENABLE_ADMIN_PANEL=true
VITE_SOURCE_MAP=true
```

### Production Environment (`.env.production`)

```env
VITE_API_URL=https://bazi-api.render.com
VITE_API_TIMEOUT=30000
VITE_APP_NAME=BaZi Mega-Evolution
VITE_APP_VERSION=2.1
VITE_ENABLE_AI_CONSULTANT=true
VITE_ENABLE_MATCHING=true
VITE_ENABLE_ARTICLES=true
VITE_ENABLE_ADMIN_PANEL=true
VITE_SOURCE_MAP=false
```

## Environment Variables

### API Configuration

- **VITE_API_URL**: Backend API URL
  - Development: `http://localhost:8888`
  - Production: `https://bazi-api.render.com`

- **VITE_API_TIMEOUT**: API request timeout in milliseconds (default: 30000)

### Application Configuration

- **VITE_APP_NAME**: Application name (default: "BaZi Mega-Evolution")
- **VITE_APP_VERSION**: Application version (default: "2.1")
- **VITE_APP_DESCRIPTION**: Application description

### Feature Flags

- **VITE_ENABLE_AI_CONSULTANT**: Enable AI consultant feature (default: true)
- **VITE_ENABLE_MATCHING**: Enable compatibility matching (default: true)
- **VITE_ENABLE_ARTICLES**: Enable articles/knowledge base (default: true)
- **VITE_ENABLE_ADMIN_PANEL**: Enable admin panel (default: true)

### Build Configuration

- **VITE_SOURCE_MAP**: Generate source maps for debugging
  - Development: `true`
  - Production: `false`

### Analytics (Optional)

- **VITE_GOOGLE_ANALYTICS_ID**: Google Analytics tracking ID
- **VITE_SENTRY_DSN**: Sentry error tracking DSN

## Using Environment Variables in Code

### In JavaScript/React

```javascript
import { appConfig, featureFlags } from './config/env.js';

// Access configuration
console.log(appConfig.apiUrl);
console.log(appConfig.version);
console.log(featureFlags.enableAiConsultant);

// Check environment
if (appConfig.isDevelopment) {
    console.log('Running in development mode');
}
```

### In Vite Config

```javascript
export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
});
```

## Build Process

### Development Build

```bash
cd frontend
npm run dev
```

- Runs Vite dev server on port 3005
- Proxies `/api` requests to `http://localhost:8888`
- Enables source maps
- Hot module replacement (HMR) enabled

### Production Build

```bash
cd frontend
npm run build
```

- Minifies JavaScript and CSS
- Generates optimized chunks
- Disables source maps (for smaller bundle)
- Removes console.log statements
- Output: `frontend/dist/`

### Preview Production Build

```bash
cd frontend
npm run preview
```

- Serves production build locally
- Useful for testing before deployment

## Build Optimization

### Code Splitting

The Vite config automatically splits code into chunks:

- **vendor**: React, React DOM, React Router
- **ui**: UI libraries (Helmet, Markdown)
- **export**: Export libraries (html2canvas, jspdf, confetti)

This improves caching and reduces initial bundle size.

### Minification

- Uses Terser for JavaScript minification
- Removes console.log and debugger statements in production
- Compresses CSS

### Asset Optimization

- Images are optimized
- CSS is minified
- JavaScript is minified and tree-shaken

## API Configuration

### Auto-Detection

The frontend automatically detects the API URL:

1. If `VITE_API_URL` is set, use it
2. In production, use same host as frontend
3. In development, use `http://localhost:8888`

### Manual Configuration

To use a specific API URL:

```javascript
// In .env.production
VITE_API_URL=https://api.example.com
```

## Deployment

### Render Static Site

1. Create `.env.production` with production values
2. Push code to Git
3. Render automatically builds and deploys
4. Build command: `npm run build`
5. Publish directory: `frontend/dist`

### Environment Variables on Render

Set these in Render dashboard:

```
VITE_API_URL=https://bazi-api.render.com
VITE_APP_VERSION=2.1
VITE_ENABLE_AI_CONSULTANT=true
VITE_ENABLE_MATCHING=true
VITE_ENABLE_ARTICLES=true
VITE_ENABLE_ADMIN_PANEL=true
```

## Troubleshooting

### API Connection Issues

**Problem**: Frontend can't connect to backend

**Solution**:
1. Check `VITE_API_URL` is correct
2. Verify backend is running
3. Check CORS configuration on backend
4. Check browser console for errors

### Build Fails

**Problem**: `npm run build` fails

**Solution**:
1. Check Node.js version (18+)
2. Clear `node_modules` and reinstall: `npm install`
3. Check for TypeScript errors: `npm run lint`
4. Check Vite config syntax

### Environment Variables Not Working

**Problem**: Environment variables not being read

**Solution**:
1. Ensure `.env` file is in `frontend/` directory
2. Restart dev server after changing `.env`
3. Use `import.meta.env.VITE_*` to access variables
4. Variables must start with `VITE_` prefix

### Large Bundle Size

**Problem**: Production bundle is too large

**Solution**:
1. Check for unused dependencies
2. Enable code splitting in Vite config
3. Use dynamic imports for large components
4. Check bundle size: `npm run build -- --analyze`

## Performance Tips

1. **Lazy Load Routes**: Use React.lazy() for route components
2. **Code Splitting**: Vite automatically splits code into chunks
3. **Image Optimization**: Use optimized image formats (WebP)
4. **Caching**: Set appropriate cache headers on Render
5. **Compression**: Render automatically gzips responses

## Security Considerations

1. **Never commit `.env` files** with sensitive data
2. **Use environment variables** for API keys
3. **Disable source maps** in production
4. **Remove console.log** statements in production
5. **Use HTTPS** in production

## Next Steps

1. Configure environment variables for your deployment
2. Test production build locally: `npm run build && npm run preview`
3. Deploy to Render
4. Monitor application performance
5. Set up error tracking (Sentry)
6. Set up analytics (Google Analytics)
