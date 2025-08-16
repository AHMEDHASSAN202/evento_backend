# Quick Start Guide

## 1. Environment Setup
```bash
cp .env.example .env
# Edit .env with your database and AWS credentials
```

## 2. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE evento_db;
exit

# Run initialization script (optional)
mysql -u root -p evento_db < database/init.sql
```

## 3. Install Dependencies
```bash
npm install
```

## 4. Start Application
```bash
npm run start:dev
```

## 5. Access API
- API Base: http://localhost:3000
- Swagger Docs: http://localhost:3000/api

## 6. Test Authentication
```bash
# Admin Login
curl -X POST http://localhost:3000/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@evento.com","password":"admin123"}'

# Send OTP
curl -X POST http://localhost:3000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890"}'
```

## Default Admin Account
- Email: admin@evento.com
- Password: admin123

## Sample Data
The database initialization script includes:
- 5 cities
- 1 admin account
- 3 sample users
- 3 sample freelancers
- 4 sample packages

