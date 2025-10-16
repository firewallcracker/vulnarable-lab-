# 🚀 Vercel Deployment Guide

## Quick Deploy Options

### Option 1: Frontend Only (Recommended)
```bash
# Deploy frontend to Vercel
cd frontend
vercel --prod

# Deploy backend to Railway/Render
# Update REACT_APP_API_URL in Vercel environment variables
```

### Option 2: Static Demo Version
```bash
# Build static version
npm run build

# Deploy to Vercel
vercel --prod
```

## Environment Variables for Vercel

```
REACT_APP_API_URL=https://your-backend.railway.app
```

## Limitations on Vercel

❌ **Cannot run**: Full backend with persistent connections  
❌ **Cannot run**: Docker containers for challenge isolation  
❌ **Cannot run**: Real-time lab management  

✅ **Can run**: Static frontend with challenge files  
✅ **Can run**: Serverless API functions  
✅ **Can run**: Demo version with simulated challenges  

## Best Approach

1. **Frontend**: Deploy to Vercel
2. **Backend**: Deploy to Railway (free tier)
3. **Database**: Use Railway PostgreSQL or keep in-memory
4. **Challenges**: Serve as static files from Vercel

This gives you the best performance and functionality!