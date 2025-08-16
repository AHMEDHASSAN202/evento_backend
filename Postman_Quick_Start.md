# Postman Collection Quick Start Guide

## 🚀 Getting Started

### 1. Import the Collection
1. Open Postman
2. Click "Import" button
3. Select the `Evento_Backend_API.postman_collection.json` file
4. The collection will appear in your Postman workspace

### 2. Set Up Environment Variables
1. Click on the "Environment" dropdown (top right)
2. Click "Add" to create a new environment
3. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` |
| `admin_token` | (leave empty) | (will be filled after login) |
| `user_token` | (leave empty) | (will be filled after login) |
| `freelancer_token` | (leave empty) | (will be filled after login) |

4. Save the environment and select it from the dropdown

---

## 🔐 Authentication Flow

### Step 1: Admin Login
1. Find "Admin Login" in the Authentication folder
2. Click "Send"
3. Copy the `access_token` from the response
4. Set `admin_token` environment variable to this value

### Step 2: Send OTP for User
1. Find "Send OTP" in the Authentication folder
2. Update the phone number in the request body
3. Click "Send"
4. Note the OTP from the response (in development, it's always "123456")

### Step 3: User Login
1. Find "User Login" in the Authentication folder
2. Use the phone number from Step 2 and OTP "123456"
3. Click "Send"
4. Copy the `access_token` and set `user_token` environment variable

### Step 4: Freelancer Login
1. Find "Freelancer Login" in the Authentication folder
2. Use phone `+1987654321` and OTP `123456`
3. Click "Send"
4. Copy the `access_token` and set `freelancer_token` environment variable

---

## 📱 Testing User Flow

### 1. Search for Freelancers
- Use "Search Freelancers" endpoint
- Try different query parameters:
  - `query=photography`
  - `cityIds=1,2`
  - `eventTypeId=4`

### 2. Create an Order
- Use "Create Order (User)" endpoint
- Make sure you have a valid `freelancerId` and `packageId`
- Include location coordinates and address

### 3. Pay Deposit
- Use "Pay Deposit (User)" endpoint
- This will return a Paymob iframe URL for payment

---

## 🎯 Testing Freelancer Flow

### 1. Create Packages
- Use "Create Package (Freelancer)" endpoint
- Set name, description, and price

### 2. Create Events
- Use "Create Event (Freelancer)" endpoint
- Include title, description, images, event date, and event type

### 3. Manage Orders
- Use "Accept Order" endpoint
- Use "Start Progress" endpoint
- Use "Complete Order" endpoint

---

## 🏗️ Testing Admin Flow

### 1. Manage Cities
- Use "Create City" endpoint
- Use "Get All Cities" endpoint

### 2. Manage Event Types
- Use "Create Event Type" endpoint
- Use "Get All Event Types" endpoint

### 3. Manage Users
- Use "Create Freelancer (Admin)" endpoint
- View all users and freelancers

---

## 🔍 Testing Search & Discovery

### 1. Search Events
- Use "Search Events" endpoint
- Try different queries and event type filters

### 2. Search Freelancers
- Use "Search Freelancers" endpoint
- Combine multiple search criteria

---

## 💳 Testing Payment Flow

### 1. Complete Order Flow
1. **Create Order** → Status: PENDING
2. **Pay Deposit** → Status: PAID
3. **Accept Order** → Status: ACCEPTED
4. **Start Progress** → Status: IN_PROGRESS
5. **Complete Order** → Status: COMPLETED

### 2. Test Refund Scenarios
- Cancel order >24h before event → Full refund
- Cancel order <24h before event → No refund
- Reject order → Full refund

---

## 🧪 Testing Tips

### 1. Use Environment Variables
- All tokens are automatically used via environment variables
- No need to manually copy-paste tokens

### 2. Check Response Status
- Look for status codes in responses
- 200 = Success, 201 = Created, 400 = Bad Request, etc.

### 3. Test Error Cases
- Try invalid data to test validation
- Test unauthorized access with wrong tokens

### 4. Use Pre-request Scripts
- You can add scripts to automatically set tokens
- Useful for automated testing

---

## 📊 Sample Test Data

### Test Phone Numbers
- **Admin**: `admin@evento.com` / `admin123`
- **Freelancer**: `+1987654321` / OTP: `123456`
- **User**: `+1234567890` / OTP: `123456`

### Test Cities
- New York (ID: 1)
- Los Angeles (ID: 2)
- Chicago (ID: 3)
- Miami (ID: 4)
- Las Vegas (ID: 5)

### Test Event Types
- Birthday (ID: 1) - عيد ميلاد
- Baby Celebration (ID: 2) - سبوع
- Graduation (ID: 3) - حفله تخرج
- Wedding (ID: 4) - زفاف
- Engagement (ID: 5) - حفله خطوبه
- Corporate (ID: 6) - حفله شركه
- Family (ID: 7) - حفله عائليه

---

## 🚨 Common Issues & Solutions

### 1. "Unauthorized" Error
- Check if the token is set correctly
- Verify the token hasn't expired
- Make sure you're using the right token for the right role

### 2. "Not Found" Error
- Check if the IDs in the URL are correct
- Verify the resource exists in the database
- Check if the resource is active

### 3. "Bad Request" Error
- Check the request body format
- Verify all required fields are present
- Check data validation rules

### 4. "Forbidden" Error
- Check if you have the right role for the endpoint
- Verify the resource belongs to you (for user/freelancer endpoints)

---

## 🔄 Testing Complete Workflows

### Workflow 1: User Booking Flow
1. Send OTP → User Login → Search Freelancers → Create Order → Pay Deposit

### Workflow 2: Freelancer Service Flow
1. Freelancer Login → Create Package → Create Event → Accept Order → Complete Order

### Workflow 3: Admin Management Flow
1. Admin Login → Create City → Create Event Type → Create Freelancer → View All Data

---

## 📝 Notes

- **Development Mode**: OTP is always "123456" for testing
- **Auto-creation**: Users are auto-created on first login if they don't exist
- **Soft Deletes**: Most entities use soft deletes (marked as inactive, not physically deleted)
- **Relationships**: Use the IDs returned from create operations for subsequent requests
- **Timestamps**: All entities include `createdAt` and `updatedAt` fields

---

## 🎉 Ready to Test!

You now have everything you need to test the complete Evento backend API. Start with authentication, then explore the different user roles and workflows. Happy testing! 🚀
