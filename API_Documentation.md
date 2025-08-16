# Evento Backend API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 1. Authentication Endpoints

### 1.1 Admin Login
**POST** `/auth/admin/login`

**Request Body:**
```json
{
  "email": "admin@evento.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "email": "admin@evento.com",
    "name": "Super Admin",
    "isActive": true
  }
}
```

### 1.2 Send OTP
**POST** `/auth/send-otp`

**Request Body:**
```json
{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

### 1.3 User Login
**POST** `/auth/user/login`

**Request Body:**
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "phone": "+1234567890",
    "type": "user",
    "gender": "male",
    "cities": [],
    "bio": null,
    "portfolio": null
  }
}
```

### 1.4 Freelancer Login
**POST** `/auth/freelancer/login`

**Request Body:**
```json
{
  "phone": "+1987654321",
  "otp": "123456"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "freelancer": {
    "id": 2,
    "name": "Alice Photography",
    "phone": "+1987654321",
    "type": "freelancer",
    "gender": "female",
    "cities": [{"id": 1, "name": "New York"}],
    "bio": "Professional photographer with 10+ years experience",
    "portfolio": "https://alice-photography.com"
  }
}
```

---

## 2. Admin Management

### 2.1 Create Admin
**POST** `/admins` (Admin only)

**Request Body:**
```json
{
  "email": "newadmin@evento.com",
  "password": "admin123",
  "name": "New Admin"
}
```

**Response:**
```json
{
  "id": 2,
  "email": "newadmin@evento.com",
  "name": "New Admin",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2.2 Get All Admins
**GET** `/admins` (Admin only)

**Response:**
```json
[
  {
    "id": 1,
    "email": "admin@evento.com",
    "name": "Super Admin",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

## 3. Cities Management

### 3.1 Create City
**POST** `/cities` (Admin only)

**Request Body:**
```json
{
  "name": "Dubai",
  "description": "City of Gold"
}
```

**Response:**
```json
{
  "id": 6,
  "name": "Dubai",
  "description": "City of Gold",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 3.2 Get All Cities
**GET** `/cities` (Public)

**Response:**
```json
[
  {
    "id": 1,
    "name": "New York",
    "description": "The Big Apple",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Los Angeles",
    "description": "City of Angels",
    "isActive": true
  }
]
```

---

## 4. Event Types Management

### 4.1 Create Event Type
**POST** `/event-types` (Admin only)

**Request Body:**
```json
{
  "name": "حفله عائليه",
  "description": "Family gatherings and celebrations"
}
```

**Response:**
```json
{
  "id": 8,
  "name": "حفله عائليه",
  "description": "Family gatherings and celebrations",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 4.2 Get All Event Types
**GET** `/event-types` (Public)

**Response:**
```json
[
  {
    "id": 1,
    "name": "عيد ميلاد",
    "description": "Birthday celebrations and parties",
    "isActive": true
  },
  {
    "id": 4,
    "name": "زفاف",
    "description": "Wedding celebrations and ceremonies",
    "isActive": true
  }
]
```

---

## 5. Users Management

### 5.1 Register User
**POST** `/users/register` (Public)

**Request Body:**
```json
{
  "phone": "+1234567890",
  "name": "John Doe",
  "type": "user",
  "gender": "male",
  "cityIds": [1, 2]
}
```

**Response:**
```json
{
  "id": 4,
  "phone": "+1234567890",
  "name": "John Doe",
  "type": "user",
  "gender": "male",
  "cities": [
    {"id": 1, "name": "New York"},
    {"id": 2, "name": "Los Angeles"}
  ],
  "isPhoneVerified": false,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 5.2 Create Freelancer (Admin)
**POST** `/users/freelancer` (Admin only)

**Request Body:**
```json
{
  "phone": "+1987654321",
  "name": "Alice Photography",
  "type": "freelancer",
  "gender": "female",
  "bio": "Professional photographer with 10+ years experience",
  "portfolio": "https://alice-photography.com",
  "cityIds": [1, 3]
}
```

**Response:**
```json
{
  "id": 5,
  "phone": "+1987654321",
  "name": "Alice Photography",
  "type": "freelancer",
  "gender": "female",
  "bio": "Professional photographer with 10+ years experience",
  "portfolio": "https://alice-photography.com",
  "cities": [
    {"id": 1, "name": "New York"},
    {"id": 3, "name": "Chicago"}
  ],
  "isPhoneVerified": false,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 5.3 Search Freelancers
**GET** `/users/search/freelancers` (Public)

**Query Parameters:**
- `query` (optional): Search in name or bio
- `cityIds` (optional): Comma-separated city IDs
- `eventTypeId` (optional): Event type ID filter

**Example:**
```
GET /users/search/freelancers?query=photography&cityIds=1,2&eventTypeId=4
```

**Response:**
```json
[
  {
    "id": 2,
    "name": "Alice Photography",
    "type": "freelancer",
    "gender": "female",
    "bio": "Professional photographer with 10+ years experience",
    "cities": [{"id": 1, "name": "New York"}],
    "events": [
      {
        "id": 1,
        "title": "Beautiful Wedding at Central Park",
        "eventType": {"id": 4, "name": "زفاف"}
      }
    ]
  }
]
```

---

## 6. Events Management

### 6.1 Create Event (Freelancer)
**POST** `/events` (Freelancer only)

**Request Body:**
```json
{
  "title": "Beautiful Wedding at Central Park",
  "description": "A magical wedding celebration with 200 guests",
  "images": ["wedding1.jpg", "wedding2.jpg"],
  "eventDate": "2024-06-15",
  "eventTypeId": 4
}
```

**Response:**
```json
{
  "id": 8,
  "title": "Beautiful Wedding at Central Park",
  "description": "A magical wedding celebration with 200 guests",
  "images": ["wedding1.jpg", "wedding2.jpg"],
  "eventDate": "2024-06-15",
  "freelancerId": 2,
  "eventTypeId": 4,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 6.2 Search Events
**GET** `/events/search` (Public)

**Query Parameters:**
- `query` (optional): Search in title or description
- `eventTypeId` (optional): Event type ID filter

**Example:**
```
GET /events/search?query=wedding&eventTypeId=4
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Beautiful Wedding at Central Park",
    "description": "A magical wedding celebration with 200 guests",
    "images": ["wedding1.jpg", "wedding2.jpg"],
    "eventDate": "2024-06-15",
    "freelancer": {
      "id": 2,
      "name": "Alice Photography",
      "type": "freelancer"
    },
    "eventType": {
      "id": 4,
      "name": "زفاف",
      "description": "Wedding celebrations and ceremonies"
    }
  }
]
```

---

## 7. Packages Management

### 7.1 Create Package (Freelancer)
**POST** `/packages` (Freelancer only)

**Request Body:**
```json
{
  "name": "Premium Photography Package",
  "description": "8 hours of photography, 200 edited photos",
  "price": 599.99
}
```

**Response:**
```json
{
  "id": 5,
  "name": "Premium Photography Package",
  "description": "8 hours of photography, 200 edited photos",
  "price": 599.99,
  "freelancerId": 2,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 7.2 Get All Packages
**GET** `/packages` (Public)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Basic Photography Package",
    "description": "4 hours of photography, 100 edited photos",
    "price": 299.99,
    "freelancer": {
      "id": 2,
      "name": "Alice Photography"
    },
    "isActive": true
  }
]
```

---

## 8. Orders Management

### 8.1 Create Order (User)
**POST** `/orders` (User only)

**Request Body:**
```json
{
  "freelancerId": 2,
  "packageId": 1,
  "eventDate": "2024-12-25",
  "totalAmount": 299.99,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main St, New York, NY",
  "notes": "Please arrive 30 minutes early"
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "freelancerId": 2,
  "packageId": 1,
  "status": "pending",
  "totalAmount": 299.99,
  "depositAmount": 0,
  "remainingAmount": 299.99,
  "eventDate": "2024-12-25",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main St, New York, NY",
  "notes": "Please arrive 30 minutes early",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 8.2 Pay Deposit (User)
**POST** `/payments/deposit/1` (User only)

**Response:**
```json
{
  "paymentKey": "token_123456",
  "orderId": 12345,
  "paymentId": 1,
  "amount": 29.99,
  "iframeUrl": "https://accept.paymob.com/api/acceptance/iframes/123?payment_token=token_123456"
}
```

### 8.3 Accept Order (Freelancer)
**PATCH** `/orders/1/accept` (Freelancer only)

**Response:**
```json
{
  "id": 1,
  "status": "accepted",
  "acceptedAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### 8.4 Complete Order (Freelancer)
**PATCH** `/orders/1/complete` (Freelancer only)

**Response:**
```json
{
  "id": 1,
  "status": "completed",
  "completedAt": "2024-01-15T12:00:00.000Z",
  "completedBy": "freelancer",
  "completedById": 2,
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

---

## 9. Reviews Management

### 9.1 Create Review (User)
**POST** `/reviews` (User only)

**Request Body:**
```json
{
  "freelancerId": 2,
  "rating": 5,
  "comment": "Excellent service! Very professional and punctual."
}
```

**Response:**
```json
{
  "id": 1,
  "rating": 5,
  "comment": "Excellent service! Very professional and punctual.",
  "userId": 1,
  "freelancerId": 2,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 9.2 Get Reviews by Freelancer
**GET** `/reviews/freelancer/2` (Public)

**Response:**
```json
[
  {
    "id": 1,
    "rating": 5,
    "comment": "Excellent service! Very professional and punctual.",
    "user": {
      "id": 1,
      "name": "John Doe"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## 10. Payments & Webhooks

### 10.1 Get Order Payments
**GET** `/payments/order/1` (User only)

**Response:**
```json
[
  {
    "id": 1,
    "type": "deposit",
    "status": "success",
    "gateway": "paymob",
    "amount": 29.99,
    "gatewayTransactionId": "txn_123456",
    "gatewayOrderId": "12345",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 10.2 Get Payment History
**GET** `/payments/history` (User only)

**Response:**
```json
[
  {
    "id": 1,
    "type": "deposit",
    "status": "success",
    "gateway": "paymob",
    "amount": 29.99,
    "order": {
      "id": 1,
      "status": "paid"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 10.3 Paymob Webhook Callback
**POST** `/webhooks/paymob/callback` (Paymob)

**Request Body:**
```json
{
  "order_id": 12345,
  "success": true,
  "amount_cents": 2999,
  "transaction_id": "txn_123456"
}
```

**Response:**
```json
{
  "success": true
}
```

---

## 11. Order Status Flow

### Status Progression:
1. **PENDING** → Order created, waiting for deposit payment
2. **PAID** → 10% deposit paid, visible to freelancer
3. **ACCEPTED** → Freelancer accepted the order
4. **IN_PROGRESS** → Freelancer started working
5. **COMPLETED** → Order completed successfully
6. **REJECTED** → Order rejected (with automatic refund)
7. **CANCELLED** → Order cancelled by user (refund based on timing)

### Refund Rules:
- **>24h before event**: Full refund
- **<24h before event**: No refund
- **Rejected by admin/freelancer**: Full refund

---

## 12. Error Responses

### Common Error Format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 13. Testing with Postman

1. **Import the collection**: Import `Evento_Backend_API.postman_collection.json`
2. **Set environment variables**:
   - `base_url`: `http://localhost:3000`
   - `admin_token`: Get from admin login
   - `user_token`: Get from user login
   - `freelancer_token`: Get from freelancer login
3. **Test flow**:
   - Start with authentication endpoints
   - Use returned tokens for protected endpoints
   - Test complete order flow: create → pay → accept → complete

---

## 14. Sample Data for Testing

### Test Users:
- **Admin**: `admin@evento.com` / `admin123`
- **Freelancer**: `+1987654321` / OTP: `123456`
- **User**: `+1234567890` / OTP: `123456`

### Test Cities:
- New York, Los Angeles, Chicago, Miami, Las Vegas

### Test Event Types:
- عيد ميلاد, سبوع, حفله تخرج, زفاف, حفله خطوبه, حفله شركه, حفله عائليه

---

## 15. Production Considerations

1. **HTTPS**: Use HTTPS in production
2. **Rate Limiting**: Implement API rate limiting
3. **Validation**: All inputs are validated server-side
4. **Logging**: Complete request/response logging
5. **Security**: JWT tokens with expiration
6. **Webhooks**: Secure webhook endpoints
7. **Database**: Use production MySQL with proper indexing
