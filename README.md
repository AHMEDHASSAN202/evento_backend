# Evento Backend API

A comprehensive backend API for the Evento platform, built with NestJS, TypeScript, and MySQL.

## Features

- **Authentication System**: JWT-based authentication for admins, users, and freelancers
- **User Management**: Full CRUD operations for users and freelancers
- **Admin Management**: Complete admin account management system
- **City Management**: CRUD operations for cities
- **Package Management**: Freelancer service packages
- **Order Management**: Customer order processing
- **Review System**: Customer reviews and ratings
- **File Upload**: AWS S3 integration for profile pictures and portfolio images
- **API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport
- **File Storage**: AWS S3
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- AWS S3 account (for file uploads)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd evento_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=evento_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=evento-bucket

# App Configuration
APP_PORT=3000
APP_ENV=development

# OTP Configuration
OTP_EXPIRES_IN=300000
```

5. Create MySQL database:
```sql
CREATE DATABASE evento_db;
```

6. Run the application:
```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## API Endpoints

### Authentication
- `POST /auth/admin/login` - Admin login with email/password
- `POST /auth/user/login` - User login with phone/OTP
- `POST /auth/freelancer/login` - Freelancer login with phone/OTP
- `POST /auth/send-otp` - Send OTP to phone number

### Admins
- `GET /admins` - Get all admins
- `POST /admins` - Create new admin
- `GET /admins/:id` - Get admin by ID
- `PATCH /admins/:id` - Update admin
- `DELETE /admins/:id` - Delete admin
- `PATCH /admins/:id/activate` - Activate admin
- `PATCH /admins/:id/deactivate` - Deactivate admin

### Cities
- `GET /cities` - Get all active cities
- `POST /cities` - Create new city
- `GET /cities/:id` - Get city by ID
- `PATCH /cities/:id` - Update city
- `DELETE /cities/:id` - Delete city
- `PATCH /cities/:id/activate` - Activate city
- `PATCH /cities/:id/deactivate` - Deactivate city

### Users
- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PATCH /users/:id/activate` - Activate user
- `PATCH /users/:id/deactivate` - Deactivate user

### Freelancers
- `GET /freelancers` - Get all freelancers
- `POST /freelancers` - Create new freelancer
- `GET /freelancers/:id` - Get freelancer by ID
- `PATCH /freelancers/:id` - Update freelancer
- `DELETE /freelancers/:id` - Delete freelancer
- `PATCH /freelancers/:id/activate` - Activate freelancer
- `PATCH /freelancers/:id/deactivate` - Deactivate freelancer

### Packages
- `GET /packages` - Get all active packages
- `POST /packages` - Create new package
- `GET /packages/:id` - Get package by ID
- `PATCH /packages/:id` - Update package
- `DELETE /packages/:id` - Delete package
- `PATCH /packages/:id/activate` - Activate package
- `PATCH /packages/:id/deactivate` - Deactivate package

### Orders
- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get order by ID
- `PATCH /orders/:id` - Update order
- `PATCH /orders/:id/status` - Update order status
- `DELETE /orders/:id` - Delete order

### Reviews
- `GET /reviews` - Get all reviews
- `POST /reviews` - Create new review
- `GET /reviews/:id` - Get review by ID
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review
- `GET /reviews/freelancer/:freelancerId/average-rating` - Get average rating

### File Upload
- `POST /upload/profile-picture/:type/:id` - Upload profile picture
- `POST /upload/portfolio/:freelancerId` - Upload portfolio image
- `POST /upload/package/:packageId` - Upload package image

## Database Schema

The application uses the following main entities:

- **Admin**: Admin accounts with email/password authentication
- **User**: Customer accounts with phone-based authentication
- **Freelancer**: Service provider accounts
- **City**: Cities where services are available
- **Package**: Service packages offered by freelancers
- **Order**: Customer orders for services
- **Review**: Customer reviews and ratings
- **OTP**: One-time passwords for phone verification

## Authentication

- **Admins**: Email and password authentication
- **Users/Freelancers**: Phone number and OTP authentication
- **JWT tokens**: Used for protecting API endpoints
- **Role-based access**: Different permissions for different user types

## File Upload

- **AWS S3**: All files are stored in Amazon S3
- **Supported formats**: JPEG, PNG, GIF, WebP, PDF
- **File size limit**: 5MB per file
- **Organized storage**: Files are organized by type and ID

## Development

### Running Tests
```bash
npm run test
npm run test:e2e
```

### Code Formatting
```bash
npm run format
npm run lint
```

### Database Migrations
The application uses TypeORM's synchronize option in development mode. For production, consider using migrations.

## Production Deployment

1. Set `APP_ENV=production` in your environment
2. Configure proper SSL certificates
3. Set up a production MySQL instance
4. Configure AWS S3 with proper IAM permissions
5. Use environment-specific configuration files
6. Set up proper logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
