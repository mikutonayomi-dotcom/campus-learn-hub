# Railway Monorepo Deployment Fix

## Issue
Railway deployment failed because the repository is a monorepo with:
- `Backend/` - Laravel PHP application
- `Frontend/` - React/Vite application

Railway scanned the root directory and found no recognizable project files.

## Solution

### Option 1: Deploy Database Only (Recommended)
If using Railway only for MySQL database:

1. **Create Railway Service for MySQL**
   - Go to Railway dashboard
   - Click "New Project" → "Add Service" → "Database" → "MySQL"
   - Railway will create a MySQL instance
   - No build configuration needed

2. **Deploy Backend to Render**
   - Use the existing `Backend/render.yaml` configuration
   - Connect the Render backend to the Railway MySQL database

### Option 2: Deploy Backend to Railway
If you want to deploy the Laravel backend to Railway instead of Render:

1. **Create Railway Service for Backend**
   - Go to Railway dashboard
   - Click "New Project" → "Add Service" → "Deploy from GitHub repo"
   - **IMPORTANT:** Set "Root Directory" to `Backend`
   - Railway will now scan the `Backend/` directory and find the Laravel project

2. **Configure Environment Variables**
   In Railway dashboard, add these variables:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:YOUR_GENERATED_KEY_HERE
   APP_URL=https://your-backend-name.railway.app
   DB_CONNECTION=mysql
   DB_HOST=<from Railway MySQL service>
   DB_PORT=3306
   DB_DATABASE=<from Railway MySQL service>
   DB_USERNAME=<from Railway MySQL service>
   DB_PASSWORD=<from Railway MySQL service>
   FRONTEND_URL_PRODUCTION=https://your-frontend-domain.netlify.app
   SANCTUM_STATEFUL_DOMAINS=https://your-frontend-domain.netlify.app
   SESSION_DOMAIN=.railway.app
   ```

3. **Run Migrations**
   After deployment, open Railway console for the backend service and run:
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   php artisan storage:link
   ```

### Option 3: Deploy Frontend to Railway
If you want to deploy the React frontend to Railway instead of Netlify:

1. **Create Railway Service for Frontend**
   - Go to Railway dashboard
   - Click "New Project" → "Add Service" → "Deploy from GitHub repo"
   - **IMPORTANT:** Set "Root Directory" to `Frontend`
   - Railway will now scan the `Frontend/` directory and find the Vite project

2. **Configure Environment Variables**
   ```env
   VITE_API_URL=https://your-backend-domain.railway.app/api
   ```

## Recommended Architecture

For this project, the recommended deployment architecture is:

- **Database:** Railway (MySQL)
- **Backend:** Render (Laravel) - using `Backend/render.yaml`
- **Frontend:** Netlify (React) - using `Frontend/netlify.toml`

This separates concerns and uses each platform for its strengths:
- Railway: Excellent for databases
- Render: Great for PHP/Laravel applications
- Netlify: Optimized for static React/Vite builds

## Quick Fix for Current Issue

If you're currently trying to deploy to Railway and getting this error:

1. Delete the failed Railway service
2. Create a new service
3. **Set "Root Directory" to `Backend`** (if deploying backend) or `Frontend` (if deploying frontend)
4. Continue with deployment

Or, if you only need the database:
1. Delete the failed service
2. Create a new "Database" → "MySQL" service (no root directory needed)
