# Mobile App to Laravel Backend Connection Guide

This guide will help you connect your React Native Expo mobile app to your Laravel microfinance system for payment processing.

## Prerequisites

1. **Laravel Backend Running**: Your Laravel microfinance system should be running on `localhost:8000`
2. **Mobile App Setup**: Your React Native Expo app should be properly configured
3. **Network Access**: Both apps should be on the same network or accessible to each other

## Step 1: Laravel Backend Setup

### 1.1 Start Laravel Server

```bash
cd microfinance-system
php artisan serve --host=0.0.0.0 --port=8000
```

### 1.2 Verify API Endpoints

Test the following endpoints in your browser or Postman:

- **Test Connection**: `GET http://localhost:8000/api/test`
- **Authentication**: `POST http://localhost:8000/api/auth/login`
- **Payment Search**: `POST http://localhost:8000/api/mobile/search-loan`

### 1.3 CORS Configuration

The CORS middleware has been added to allow mobile app connections. If you encounter CORS issues:

1. Check that `CorsMiddleware` is registered in `bootstrap/app.php`
2. Ensure the middleware is applied to API routes

## Step 2: Mobile App Configuration

### 2.1 Update API Base URL

In `src/utils/api.ts`, ensure the API base URL points to your Laravel server:

```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

**For physical device testing**, replace `localhost` with your computer's IP address:
```typescript
const API_BASE_URL = 'http://192.168.1.100:8000/api'; // Your computer's IP
```

### 2.2 Test Connection

Use the TestConnectionScreen to verify connectivity:

1. Navigate to the test screen in your mobile app
2. Click "Test Connection" to verify basic connectivity
3. Enter valid credentials and test authentication

## Step 3: Payment Flow Integration

### 3.1 Authentication Flow

1. **Login**: Mobile app sends credentials to `/api/auth/login`
2. **Token Storage**: App stores the Bearer token for subsequent requests
3. **Auto-logout**: App automatically logs out on 401 responses

### 3.2 Payment Processing Flow

1. **Search Loan**: User enters loan ID or NIC to find loan
2. **Get Details**: App fetches loan details and installments
3. **Process Payment**: App sends payment data to `/api/mobile/process-payment`
4. **Get Receipt**: App retrieves payment receipt for confirmation

### 3.3 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/test` | GET | Test connection |
| `/api/auth/login` | POST | User authentication |
| `/api/auth/logout` | POST | User logout |
| `/api/mobile/search-loan` | POST | Search loan by ID/NIC |
| `/api/mobile/loan/{id}/details` | GET | Get loan details |
| `/api/mobile/loan/{id}/installments` | GET | Get loan installments |
| `/api/mobile/process-payment` | POST | Process payment |
| `/api/mobile/payment/{id}/receipt` | GET | Get payment receipt |

## Step 4: Testing the Integration

### 4.1 Basic Connection Test

```bash
# Test from command line
curl http://localhost:8000/api/test
```

Expected response:
```json
{
  "status": "success",
  "message": "Mobile app connected successfully!",
  "timestamp": "2024-01-01T00:00:00.000000Z",
  "version": "1.0.0"
}
```

### 4.2 Authentication Test

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password",
    "device_name": "Mobile App"
  }'
```

### 4.3 Payment Search Test

```bash
curl -X POST http://localhost:8000/api/mobile/search-loan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "search_term": "123456789"
  }'
```

## Step 5: Troubleshooting

### 5.1 Common Issues

**Connection Refused**
- Ensure Laravel server is running on port 8000
- Check firewall settings
- Verify IP address is correct for device testing

**CORS Errors**
- Verify CORS middleware is properly configured
- Check that API routes are accessible

**Authentication Errors**
- Ensure user exists in database
- Verify password is correct
- Check Sanctum configuration

**Payment Processing Errors**
- Verify loan exists in database
- Check payment validation rules
- Ensure all required fields are provided

### 5.2 Debug Steps

1. **Check Laravel Logs**: `tail -f storage/logs/laravel.log`
2. **Test API Endpoints**: Use Postman or curl to test endpoints
3. **Check Mobile App Logs**: Use React Native Debugger or console logs
4. **Verify Database**: Ensure test data exists in database

### 5.3 Network Configuration

**For Local Development**:
- Use `localhost` or `127.0.0.1` for simulator
- Use your computer's IP address for physical devices

**For Production**:
- Update API_BASE_URL to your production server
- Ensure SSL certificates are properly configured
- Configure proper CORS origins

## Step 6: Production Deployment

### 6.1 Laravel Backend

1. Deploy Laravel to production server
2. Configure environment variables
3. Set up SSL certificates
4. Configure CORS for production domain

### 6.2 Mobile App

1. Update API_BASE_URL to production URL
2. Test all payment flows
3. Configure app signing for release
4. Deploy to app stores

## API Response Format

All API responses follow this format:

```json
{
  "status": "success|error",
  "message": "Human readable message",
  "data": {
    // Response data
  }
}
```

## Error Handling

The mobile app includes comprehensive error handling:

- Network errors are caught and displayed to user
- Authentication errors trigger automatic logout
- Payment errors show specific error messages
- Offline payment storage for network issues

## Security Considerations

1. **Token Management**: Tokens are stored securely in AsyncStorage
2. **HTTPS**: Use HTTPS in production for all API calls
3. **Input Validation**: All inputs are validated on both client and server
4. **Error Messages**: Sensitive information is not exposed in error messages

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Laravel and React Native logs
3. Test API endpoints independently
4. Verify network connectivity between devices

The integration is now ready for payment processing between your mobile app and Laravel backend! 