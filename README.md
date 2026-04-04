# CCS-Department Management System

A full-stack application with React TypeScript frontend and Laravel PHP backend with MySQL database.

## Project Structure

```
campus-learn-hub/
├── Frontend/          # React + TypeScript + Vite
└── Backend/           # Laravel + MySQL
```

## Frontend (React + TypeScript)

### Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router DOM
- React Hook Form + Zod
- TanStack Query

### Setup
```bash
cd Frontend
npm install
npm run dev
```

### Build
```bash
npm run build
```

## Backend (Laravel + MySQL)

### Tech Stack
- Laravel 10
- PHP 8.1+
- MySQL 8.0+
- Laravel Sanctum (API Authentication)

### Setup
1. Install dependencies:
```bash
cd Backend
composer install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Configure database in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ccs_department
DB_USERNAME=root
DB_PASSWORD=
```

5. Create database and run migrations:
```bash
mysql -u root -p -e "CREATE DATABASE ccs_department;"
php artisan migrate
```

6. Start the development server:
```bash
php artisan serve
```

The backend API will be available at `http://localhost:8000`

## API Endpoints

Base URL: `http://localhost:8000/api`

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user (authenticated)
- `GET /user` - Get authenticated user

## Development

### Frontend Development Server
```bash
cd Frontend
npm run dev
```
Runs on `http://localhost:8080`

### Backend Development Server
```bash
cd Backend
php artisan serve
```
Runs on `http://localhost:8000`

## License

MIT
