# Evento Backend API

A comprehensive backend API for the Evento platform - an event management system connecting freelancers with customers for various event services.

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication**: Admin, User, and Freelancer roles with JWT tokens
- **OTP-Based Login**: Secure phone verification for users and freelancers
- **Location-Based Services**: GPS coordinates and address support for orders
- **Event Type Management**: Categorized event services (Birthday, Wedding, Corporate, etc.)
- **Portfolio Management**: Freelancers can showcase their work through events
- **Advanced Search**: Multi-criteria freelancer and event discovery

### Payment System
- **Deposit Requirements**: 10% deposit payment to activate orders
- **Paymob Integration**: Professional payment gateway with secure transactions
- **Smart Refund Logic**: Automatic refunds based on timing and order status
- **Payment Logging**: Complete audit trail of all payment operations
- **Webhook Support**: Real-time payment status updates

### Order Management
- **Status Progression**: PENDING → PAID → ACCEPTED → IN_PROGRESS → COMPLETED
- **Role-Based Visibility**: Different order views for admin, user, and freelancer
- **Timing-Based Refunds**: 24-hour rule for cancellation refunds
- **Location Tracking**: GPS coordinates and address for event locations
- **Comprehensive Logging**: Timestamps for all order state changes

### User Management
- **Consolidated User Model**: Single entity for both regular users and freelancers
- **Auto-Creation**: Regular users created automatically on first login
- **Admin-Only Freelancer Creation**: Freelancer accounts managed by administrators
- **Profile Management**: Bio, portfolio, and city associations
- **Gender Requirements**: Required gender field for all users

## 🏗️ Architecture

### Technology Stack
- **Framework**: NestJS with TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport.js
- **Payment Gateway**: Paymob integration
- **File Storage**: AWS S3 (configured)
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator and Class-transformer

### Database Design
- **Soft Deletes**: Logical deletion for data integrity
- **Many-to-Many Relationships**: Users and cities, events and event types
- **Audit Trails**: Comprehensive timestamp tracking
- **Payment Records**: Complete transaction history
- **Status Tracking**: Detailed order lifecycle management

## 📊 Database Schema

### Core Entities
- **Users**: Consolidated user/freelancer entity with role-based access
- **Cities**: Geographic locations for service areas
- **Event Types**: Categorized event services (Arabic + English names)
- **Events**: Freelancer portfolio showcase with images and details
- **Packages**: Service offerings with pricing
- **Orders**: Customer bookings with location and payment tracking
- **Reviews**: Customer feedback and ratings
- **Payments**: Complete transaction history with gateway integration

### Key Relationships
- Users ↔ Cities (Many-to-Many)
- Users ↔ Events (One-to-Many)
- Users ↔ Packages (One-to-Many)
- Users ↔ Orders (One-to-Many)
- Events ↔ Event Types (Many-to-One)
- Orders ↔ Payments (One-to-Many)

## 🔐 Authentication & Authorization

### Role-Based Access Control
- **Admin Guard**: Full system access and management
- **User Guard**: Profile management and order creation
- **Freelancer Guard**: Package and event management

### Security Features
- **JWT Tokens**: Secure authentication with expiration
- **Password Hashing**: Bcrypt encryption for admin passwords
- **OTP Verification**: Phone number verification for users
- **Input Validation**: Comprehensive request validation
- **CORS Support**: Cross-origin resource sharing configuration

## 💳 Payment System

### Paymob Integration
- **Authentication**: Secure API key management
- **Order Creation**: Automated payment order setup
- **Payment Keys**: Secure iframe integration
- **Webhook Processing**: Real-time payment status updates
- **Refund Management**: Automated refund processing

### Payment Flow
1. **Order Creation** → PENDING status
2. **Deposit Payment** → 10% of package price via Paymob
3. **Payment Confirmation** → PAID status via webhook
4. **Order Processing** → Freelancer accepts and works on order
5. **Completion** → Order marked as completed

### Refund Rules
- **>24h before event**: Full refund of deposit
- **<24h before event**: No refund
- **Admin/Freelancer rejection**: Full refund
- **Automatic processing**: No manual intervention required

## 📱 API Endpoints

### Authentication
- `POST /auth/admin/login` - Admin login
- `POST /auth/send-otp` - Send OTP to phone
- `POST /auth/user/login` - User login with OTP
- `POST /auth/freelancer/login` - Freelancer login with OTP

### Admin Management
- `POST /admins` - Create admin account
- `GET /admins` - List all admins
- `PATCH /admins/:id` - Update admin
- `DELETE /admins/:id` - Deactivate admin

### Cities Management
- `POST /cities` - Create city (Admin only)
- `GET /cities` - List all cities (Public)
- `PATCH /cities/:id` - Update city (Admin only)
- `DELETE /cities/:id` - Deactivate city (Admin only)

### Event Types
- `POST /event-types` - Create event type (Admin only)
- `GET /event-types` - List all event types (Public)
- `PATCH /event-types/:id` - Update event type (Admin only)
- `DELETE /event-types/:id` - Deactivate event type (Admin only)

### Users Management
- `POST /users/register` - Register regular user (Public)
- `POST /users/freelancer` - Create freelancer (Admin only)
- `GET /users/search/freelancers` - Search freelancers (Public)
- `PATCH /users/profile/me` - Update user profile
- `PATCH /users/freelancer/profile/me` - Update freelancer profile

### Events Management
- `POST /events` - Create event (Freelancer only)
- `GET /events/search` - Search events (Public)
- `GET /events/freelancer/me` - My events (Freelancer)
- `PATCH /events/:id` - Update event (Owner only)
- `DELETE /events/:id` - Delete event (Owner only)

### Packages Management
- `POST /packages` - Create package (Freelancer only)
- `GET /packages` - List all packages (Public)
- `PATCH /packages/:id` - Update package (Owner only)
- `DELETE /packages/:id` - Delete package (Owner only)

### Orders Management
- `POST /orders` - Create order (User only)
- `GET /orders/my-orders` - User's orders
- `GET /orders/freelancer/orders` - Freelancer's orders
- `PATCH /orders/:id/accept` - Accept order (Freelancer)
- `PATCH /orders/:id/complete` - Complete order (Freelancer)
- `PATCH /orders/:id/cancel` - Cancel order (User)

### Payments Management
- `POST /payments/deposit/:orderId` - Pay deposit (User)
- `GET /payments/order/:orderId` - Order payment history
- `GET /payments/history` - User payment history
- `POST /webhooks/paymob/callback` - Paymob webhook

### Reviews Management
- `POST /reviews` - Create review (User only)
- `GET /reviews/freelancer/:id` - Freelancer reviews (Public)
- `PATCH /reviews/:id` - Update review (Owner only)
- `DELETE /reviews/:id` - Delete review (Owner only)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd evento_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Update .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE evento_db;
   
   # Run initialization script
   mysql -u root -p evento_db < database/init.sql
   ```

5. **Start the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production build
   npm run build
   npm run start:prod
   ```

### Environment Variables

```bash
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

# Paymob Configuration
PAYMOB_API_KEY=your_paymob_api_key
PAYMOB_INTEGRATION_ID=your_paymob_integration_id
PAYMOB_IFRAME_ID=your_paymob_iframe_id
PAYMOB_BASE_URL=https://accept.paymob.com/api
PAYMOB_WEBHOOK_SECRET=your_paymob_webhook_secret
```

## 🧪 Testing

### Postman Collection
- Import `Evento_Backend_API.postman_collection.json` into Postman
- Set up environment variables for tokens
- Follow the testing guide in `Postman_Quick_Start.md`

### Sample Test Data
- **Admin**: `admin@evento.com` / `admin123`
- **Freelancer**: `+1987654321` / OTP: `123456`
- **User**: `+1234567890` / OTP: `123456`

### API Documentation
- Swagger UI available at `http://localhost:3000/api`
- Complete API documentation in `API_Documentation.md`

## 🔄 Order Status Flow

### Complete Workflow
1. **PENDING** → Order created, waiting for deposit
2. **PAID** → 10% deposit paid, visible to freelancer
3. **ACCEPTED** → Freelancer accepted the order
4. **IN_PROGRESS** → Freelancer started working
5. **COMPLETED** → Order completed successfully

### Alternative Paths
- **REJECTED** → Order rejected (with automatic refund)
- **CANCELLED** → Order cancelled by user (refund based on timing)

## 🌍 Event Types

### Arabic Names with English Descriptions
- **عيد ميلاد** - Birthday celebrations and parties
- **سبوع** - Baby celebration (7th day after birth)
- **حفله تخرج** - Graduation parties and ceremonies
- **زفاف** - Wedding celebrations and ceremonies
- **حفله خطوبه** - Engagement parties and celebrations
- **حفله شركه** - Corporate events and company parties
- **حفله عائليه** - Family gatherings and celebrations

## 📊 Sample Data

### Cities
- New York, Los Angeles, Chicago, Miami, Las Vegas

### Freelancers
- Alice Photography (Photography services)
- Mike Videography (Video production)
- Sarah DJ (Music and entertainment)

### Packages
- Basic Photography Package ($299.99)
- Premium Photography Package ($599.99)
- Basic Videography Package ($399.99)
- DJ Package ($199.99)

## 🚨 Error Handling

### Common Error Responses
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 🔒 Security Features

### Authentication
- JWT token-based authentication
- Role-based access control
- Secure password hashing
- OTP verification for phone numbers

### Data Protection
- Input validation and sanitization
- SQL injection prevention via TypeORM
- CORS configuration
- Environment variable protection

### Payment Security
- Secure payment gateway integration
- Webhook signature verification
- Complete payment audit trail
- Automatic refund processing

## 📈 Performance & Scalability

### Database Optimization
- Proper indexing on frequently queried fields
- Soft deletes for data integrity
- Efficient relationship queries
- Connection pooling

### API Optimization
- Pagination support for large datasets
- Efficient search algorithms
- Caching-ready architecture
- Async/await pattern usage

## 🚀 Deployment

### Production Considerations
1. **Environment**: Set `APP_ENV=production`
2. **Database**: Use production MySQL with proper indexing
3. **HTTPS**: Enable SSL/TLS encryption
4. **Rate Limiting**: Implement API rate limiting
5. **Monitoring**: Set up application monitoring
6. **Backups**: Regular database backups
7. **Logging**: Production-grade logging

### Docker Support
```bash
# Build image
docker build -t evento-backend .

# Run container
docker run -p 3000:3000 evento-backend
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use NestJS decorators and patterns
- Maintain consistent code formatting
- Add proper documentation

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Documentation
- **API Documentation**: `API_Documentation.md`
- **Postman Guide**: `Postman_Quick_Start.md`
- **Swagger UI**: Available at `/api` endpoint

### Issues
- Report bugs via GitHub Issues
- Include detailed error messages and steps to reproduce
- Provide environment information and logs

## 🎯 Roadmap

### Future Enhancements
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app API endpoints
- [ ] Advanced search filters
- [ ] Payment gateway expansion
- [ ] Automated testing suite
- [ ] Performance monitoring

---

## 🎉 Conclusion

The Evento Backend API provides a robust, scalable, and secure foundation for event management services. With comprehensive payment integration, advanced order management, and role-based access control, it's ready for production deployment and can handle the complex requirements of modern event service platforms.

For questions, support, or contributions, please refer to the documentation or create an issue in the repository.

**Happy coding! 🚀✨**
