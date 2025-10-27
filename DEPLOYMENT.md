# Deployment Guide

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The production files will be in the `dist/` directory.

## Deployment Options

### 1. Static Hosting (Recommended)

The app is a static single-page application (SPA) and can be deployed to any static hosting service.

#### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

Or use Netlify's GitHub integration for automatic deployments.

**netlify.toml** (optional):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

#### GitHub Pages

1. Install gh-pages:
```bash
npm install -D gh-pages
```

2. Add to package.json:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/repository-name"
}
```

3. Update vite.config.ts:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/repository-name/'
})
```

4. Deploy:
```bash
npm run deploy
```

#### AWS S3 + CloudFront

1. Build the project:
```bash
npm run build
```

2. Upload to S3:
```bash
aws s3 sync dist/ s3://your-bucket-name
```

3. Configure S3 bucket for static website hosting
4. Set up CloudFront distribution
5. Configure error pages to redirect to index.html for SPA routing

### 2. Docker Deployment

**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Build and run:
```bash
docker build -t heart-recorder .
docker run -p 8080:80 heart-recorder
```

### 3. Node.js Server

If you need a Node.js server for additional backend functionality:

**server.js**:
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Environment Configuration

### Development
Create `.env.development`:
```bash
VITE_API_URL=http://localhost:3000
```

### Production
Create `.env.production`:
```bash
VITE_API_URL=https://api.yourapp.com
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Important Considerations

### 1. HTTPS Requirement
The microphone API requires HTTPS or localhost. Ensure your production deployment uses HTTPS.

### 2. Browser Compatibility
The app requires modern browser features:
- MediaRecorder API
- AudioContext API
- LocalStorage
- ES6+ support

Minimum versions:
- Chrome/Edge: 88+
- Firefox: 85+
- Safari: 14.1+

### 3. Performance Optimization

Already included in the build:
- ✅ Tree-shaking
- ✅ Code minification
- ✅ Asset optimization
- ✅ Gzip compression

Additional optimizations:
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'mui': ['@mui/material', '@mui/icons-material'],
          'charts': ['recharts'],
        },
      },
    },
  },
});
```

### 4. Asset Caching

Configure cache headers for static assets:

**Nginx**:
```nginx
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Netlify** (_headers file):
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### 5. Security Headers

Add security headers in your hosting configuration:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: microphone=(self)
```

## CI/CD Example (GitHub Actions)

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: './dist'
        production-deploy: true
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Monitoring & Analytics

### Add Google Analytics
```typescript
// src/main.tsx
import ReactGA from 'react-ga4';

if (import.meta.env.PROD) {
  ReactGA.initialize('G-XXXXXXXXXX');
}
```

### Error Tracking (Sentry)
```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'your-sentry-dsn',
    environment: 'production',
  });
}
```

## Post-Deployment Checklist

- [ ] Test audio recording in production environment
- [ ] Verify HTTPS is enabled
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Verify LocalStorage persistence
- [ ] Test export functionality
- [ ] Test import functionality
- [ ] Verify language switching works
- [ ] Check console for errors
- [ ] Test with microphone permissions denied
- [ ] Verify all translations load correctly

## Troubleshooting

### Issue: Blank page after deployment
- Check browser console for errors
- Verify `base` path in vite.config.ts matches deployment path
- Ensure SPA fallback is configured (redirects to index.html)

### Issue: Microphone access denied
- Ensure site is served over HTTPS
- Check browser permissions
- Test with different microphone devices

### Issue: Build fails
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 16+)
- Clear build cache: `rm -rf dist`

### Issue: Large bundle size
- Implement code splitting (see Performance Optimization above)
- Use dynamic imports for heavy components
- Analyze bundle: `npm run build -- --mode analyze`

## Support

For issues or questions:
1. Check browser console for errors
2. Verify environment configuration
3. Test in development mode first
4. Review deployment logs

## Next Steps

After successful deployment:
1. Set up monitoring and error tracking
2. Configure analytics
3. Set up automated backups
4. Implement CDN for assets
5. Configure custom domain
6. Set up staging environment
7. Implement automated testing in CI/CD

