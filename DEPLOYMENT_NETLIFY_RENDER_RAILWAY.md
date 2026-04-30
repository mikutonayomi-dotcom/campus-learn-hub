# CCS Department System - Deployment Guide (Netlify + Render + Railway)

## Deployment Architecture

- **Frontend**: Netlify (React + Vite)
- **Backend**: Render (Laravel API)
- **Database**: Railway (MySQL)

---

## 1. Database Deployment (Railway)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up and create a new project

### Step 2: Add MySQL Database
1. Click "New Project" → "Provision MySQL"
2. Railway will create a MySQL instance
3. Note the following from the Variables tab:
   - `RAILWAY_PRIVATE_DOMAIN` (host)
   - `RAILWAY_TCP_PROXY_DOMAIN` (for external connections)
   - `MYSQL_DATABASE` (database name)
   - `MYSQLUSER` (username)
   - `MYSQLPASSWORD` (password)
   - `MYSQLPORT` (port)

### Step 3: Run Migrations (Optional - via Railway Console)
1. Go to your MySQL service on Railway
2. Click "Console" tab
3. You can run SQL commands directly or use the Railway CLI to run migrations

---

## 2. Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up and connect your GitHub repository

### Step 3: Configure Environment Variables
In Render dashboard, add these environment variables:

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_URL=https://your-backend-name.onrender.com

# Database (from Railway)
DB_CONNECTION=mysql
DB_HOST=your-railway-mysql-host.railway.app
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=your-railway-password

# CORS Settings
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_PRODUCTION=https://your-frontend-name.netlify.app
SANCTUM_STATEFUL_DOMAINS=https://your-frontend-name.netlify.app
SESSION_DOMAIN=.onrender.com

# File Storage
FILESYSTEM_DISK=local
```

### Step 4: Deploy
1. Push your code to GitHub
2. Render will auto-deploy from the `render.yaml` file
3. Monitor the deployment logs

### Step 5: Run Migrations via Render SSH
After deployment, SSH into your Render service and run:

```bash
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
```

---

## 3. Frontend Deployment (Netlify)

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up and connect your GitHub repository

### Step 2: Configure Build Settings
Netlify will automatically detect the `netlify.toml` file. Ensure:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### Step 3: Add Environment Variable
In Netlify dashboard → Site settings → Environment variables:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

### Step 4: Deploy
1. Push your code to GitHub
2. Netlify will auto-deploy
3. Your site will be available at `https://your-site-name.netlify.app`

---

## 4. Post-Deployment Configuration

### Update Backend CORS
After getting your Netlify URL, update the backend environment variables on Render:

```env
FRONTEND_URL_PRODUCTION=https://your-actual-frontend-name.netlify.app
SANCTUM_STATEFUL_DOMAINS=https://your-actual-frontend-name.netlify.app
```

### Update Frontend API URL
Update the Netlify environment variable with your actual Render backend URL:

```env
VITE_API_URL=https://your-actual-backend-name.onrender.com/api
```

---

## 5. Verification Checklist

- [ ] Railway MySQL database is running
- [ ] Backend deployed on Render successfully
- [ ] Frontend deployed on Netlify successfully
- [ ] Database migrations run on Railway
- [ ] Database seeders run successfully
- [ ] CORS configured correctly between Netlify and Render
- [ ] Login functionality works
- [ ] File uploads work (profile images, materials)
- [ ] Report downloads work

---

## 6. Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL_PRODUCTION` matches your Netlify URL exactly
- Check that both frontend and backend use HTTPS
- Ensure `SANCTUM_STATEFUL_DOMAINS` is set correctly

### Database Connection Failed
- Verify Railway database credentials in Render environment
- Check that Railway MySQL service is running
- Ensure the database host is accessible from Render

### File Upload Issues
- Run `php artisan storage:link` on Render via SSH
- Ensure `storage/app/public` has write permissions
- Check file size limits in `php.ini`

### Build Failures
- Check Render build logs for specific errors
- Ensure `composer install` completes successfully
- Verify all dependencies are compatible with PHP 8.2

---

## 7. Local Development

To run locally with production-like settings:

### Backend
```bash
cp .env.example .env
# Update .env with local database settings
composer install
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend
```bash
cp .env.example .env
# Update .env with local backend URL
npm install
npm run dev
```

---

## 8. Maintenance

### Backup Database
Railway provides automatic backups. You can also export manually:

```bash
# Via Railway CLI
railway login
railway connect
railway mysql export > backup.sql
```

### Update Dependencies
```bash
# Backend
composer update

# Frontend
npm update
```

### Clear Cache (Render)
SSH into Render service and run:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

## 9. Security Notes

- Change default admin password after first login
- Use strong database passwords
- Enable HTTPS for all services
- Regularly update dependencies
- Monitor logs for suspicious activity
- Set up regular database backups
