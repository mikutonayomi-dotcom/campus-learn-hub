# CCS Department System - Deployment Guide

## Prerequisites

- Server with PHP 8.2 or higher
- MySQL 8.0 or higher
- Node.js 18 or higher
- Composer
- Git
- SSL Certificate (for production)

## Backend Deployment (Laravel)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd campus-learn-hub/Backend
```

### 2. Install Dependencies

```bash
composer install --optimize-autoloader --no-dev
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```env
APP_NAME=CCS-Department
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-backend-domain.com

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ccs-department
DB_USERNAME=your_db_user
DB_PASSWORD=your_secure_password

# CORS Settings
FRONTEND_URL=https://your-frontend-domain.com
FRONTEND_URL_PRODUCTION=https://your-frontend-domain.com
SANCTUM_STATEFUL_DOMAINS=https://your-frontend-domain.com
SESSION_DOMAIN=.your-domain.com
```

Generate application key:

```bash
php artisan key:generate
```

### 4. Set Permissions

```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache
```

### 5. Run Migrations

```bash
php artisan migrate --force
```

### 6. Seed Database (Optional)

```bash
php artisan db:seed --force
```

### 7. Optimize Application

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 8. Configure Web Server

#### Apache (.htaccess)

Ensure the following is in your `.htaccess` file:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

#### Nginx

```nginx
server {
    listen 80;
    server_name your-backend-domain.com;
    root /var/www/campus-learn-hub/Backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 9. Configure SSL (Recommended)

Use Let's Encrypt or your SSL certificate to enable HTTPS.

## Frontend Deployment (React + Vite)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd campus-learn-hub/Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env.production` file:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### 4. Build for Production

```bash
npm run build
```

### 5. Deploy Build Files

The build files will be in the `dist/` directory. Upload these to your web server.

#### Apache

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx

```nginx
server {
    listen 80;
    server_name your-frontend-domain.com;
    root /var/www/campus-learn-hub/Frontend/dist;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 6. Configure SSL (Recommended)

Enable HTTPS for the frontend.

## Database Setup

### Create Database

```sql
CREATE DATABASE ccs_department CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ccs_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON ccs_department.* TO 'ccs_user'@'localhost';
FLUSH PRIVILEGES;
```

### Run Migrations

From the Backend directory:

```bash
php artisan migrate --force
```

### Seed Data (Optional)

```bash
php artisan db:seed --force
```

Or run specific seeders:

```bash
php artisan db:seed --class=SkillsSeeder
php artisan db:seed --class=OrganizationsSeeder
php artisan db:seed --class=SampleProfileDataSeeder
```

## Post-Deployment Checklist

- [ ] Backend `.env` configured with production values
- [ ] Frontend `.env.production` configured with backend URL
- [ ] Database migrations run successfully
- [ ] SSL certificates installed and HTTPS enabled
- [ ] CORS settings configured correctly
- [ ] File permissions set correctly
- [ ] Application cache cleared and optimized
- [ ] Test login functionality
- [ ] Test file uploads (profile images, materials)
- [ ] Test report generation and downloads
- [ ] Test all CRUD operations
- [ ] Verify email notifications (if configured)

## Troubleshooting

### 500 Internal Server Error

- Check Laravel logs: `storage/logs/laravel.log`
- Verify file permissions
- Ensure `.env` file exists and is configured
- Run `php artisan config:clear`

### CORS Errors

- Verify `FRONTEND_URL_PRODUCTION` in backend `.env`
- Check `config/cors.php` configuration
- Ensure both frontend and backend use HTTPS

### Database Connection Failed

- Verify database credentials in `.env`
- Ensure MySQL service is running
- Check database user permissions
- Verify database exists

### File Upload Issues

- Check `storage/app/public` permissions
- Ensure `php.ini` allows required file sizes
- Verify symlink exists: `php artisan storage:link`

## Security Recommendations

1. **Use HTTPS** - Enable SSL for both frontend and backend
2. **Strong Passwords** - Use strong database and application passwords
3. **Firewall** - Configure firewall to allow only necessary ports
4. **Regular Updates** - Keep PHP, MySQL, and dependencies updated
5. **Backup** - Set up regular database backups
6. **Monitor Logs** - Regularly check application logs for suspicious activity
7. **Disable Debug Mode** - Ensure `APP_DEBUG=false` in production

## Maintenance

### Clear Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Backup Database

```bash
mysqldump -u username -p database_name > backup.sql
```

### Update Dependencies

```bash
# Backend
composer update

# Frontend
npm update
```

## Support

For issues or questions, refer to the project documentation or contact the development team.
