# API Integration Documentation

## Overview

The EDI Vendor Onboarding Form now includes full API integration with authentication using Bearer tokens. The application uses Axios for HTTP requests and includes request/response interceptors for logging and error handling.

## Authentication

### API Key Configuration

The application uses environment variables to store sensitive API credentials securely.

**File: `.env`**
```env
VITE_API_KEY=pk_82243107_ZTM4488GLERKVNOKQ8UBSO1F4SSQLJNO
VITE_API_BASE_URL=https://api.yourdomain.com/v1
```

⚠️ **SECURITY WARNING**: The `.env` file is included in `.gitignore` and should NEVER be committed to version control.

### Authentication Flow

All API requests automatically include the API key in the Authorization header:

```javascript
Authorization: Bearer pk_82243107_ZTM4488GLERKVNOKQ8UBSO1F4SSQLJNO
```

This is handled automatically by the Axios request interceptor in `src/services/api.js`.

## API Endpoints

### 1. Submit Onboarding Form

**Endpoint**: `POST /onboarding`

**Description**: Submit complete onboarding form data

**Request Body**:
```json
{
  "section1Data": {
    "companyName": "string",
    "contactName": "string",
    "contactEmail": "string",
    "contactPhone": "string"
  },
  "selectedTransactions": [
    {
      "type": "string",
      "direction": "string",
      "frequency": "string",
      "requiredOptional": "string",
      "hasImplementationGuide": "string",
      "canProvideSamples": "string",
      "hasMappingSpecs": "string",
      "hasSystemDocs": "string",
      "require997FromUs": "string",
      "willSend997": "string"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "onboarding_123",
    "status": "submitted",
    "createdAt": "2025-10-29T12:00:00Z"
  },
  "message": "Form submitted successfully"
}
```

**Usage**:
```javascript
import { submitOnboardingForm } from './services/api'

const result = await submitOnboardingForm(formData)
if (result.success) {
  console.log('Submitted:', result.data)
}
```

---

### 2. Save Draft

**Endpoint**: `POST /onboarding/draft`

**Description**: Save incomplete or complete form data as a draft

**Request Body**:
```json
{
  "section1Data": { ... },
  "selectedTransactions": [ ... ],
  "currentStep": 1,
  "savedAt": "2025-10-29T12:00:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "draftId": "draft_456",
    "savedAt": "2025-10-29T12:00:00Z"
  },
  "message": "Draft saved successfully"
}
```

**Usage**:
```javascript
import { saveDraft } from './services/api'

const result = await saveDraft(formData)
if (result.success) {
  console.log('Draft saved:', result.data)
}
```

---

### 3. Get Transaction Types

**Endpoint**: `GET /transaction-types`

**Description**: Retrieve list of available EDI transaction types

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "label": "Retail & Consumer Goods",
      "options": [
        "810 - Invoice",
        "850 - Purchase Order",
        ...
      ]
    },
    ...
  ],
  "message": "Transaction types retrieved successfully"
}
```

**Usage**:
```javascript
import { getTransactionTypes } from './services/api'

const result = await getTransactionTypes()
if (result.success) {
  console.log('Transaction types:', result.data)
}
```

---

### 4. Validate Company Info

**Endpoint**: `POST /validate/company`

**Description**: Validate company information before submission

**Request Body**:
```json
{
  "companyName": "string",
  "contactName": "string",
  "contactEmail": "string",
  "contactPhone": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "valid": true,
    "warnings": []
  },
  "message": "Company information validated"
}
```

---

### 5. Get Onboarding by ID

**Endpoint**: `GET /onboarding/{onboardingId}`

**Description**: Retrieve existing onboarding data

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "onboarding_123",
    "section1Data": { ... },
    "selectedTransactions": [ ... ],
    "status": "submitted",
    "createdAt": "2025-10-29T12:00:00Z"
  },
  "message": "Onboarding data retrieved successfully"
}
```

---

### 6. Update Onboarding

**Endpoint**: `PUT /onboarding/{onboardingId}`

**Description**: Update existing onboarding

**Request Body**: Same as submit onboarding

---

### 7. Test Connection

**Endpoint**: `GET /health`

**Description**: Test API connection and authentication

**Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "authenticated": true,
    "timestamp": "2025-10-29T12:00:00Z"
  },
  "message": "Connection successful"
}
```

**Usage**:
```javascript
import { testConnection } from './services/api'

const result = await testConnection()
if (result.success) {
  console.log('API is healthy:', result.data)
}
```

---

## Error Handling

### HTTP Status Codes

- **401 Unauthorized**: Invalid or missing API key
- **403 Forbidden**: API key valid but lacks permissions
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server-side error

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  },
  "message": "Failed to submit form"
}
```

### Client-Side Error Handling

All API methods return a consistent response format:

```javascript
const result = await submitOnboardingForm(formData)

if (result.success) {
  // Handle success
  console.log('Success:', result.data)
} else {
  // Handle error
  console.error('Error:', result.error)
  console.error('Message:', result.message)
}
```

---

## Axios Configuration

### Base Configuration

**File**: `src/services/api.js`

```javascript
const apiClient = axios.create({
  baseURL: 'https://api.yourdomain.com/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})
```

### Request Interceptor

Automatically adds authentication to every request:

```javascript
apiClient.interceptors.request.use((config) => {
  if (API_KEY) {
    config.headers.Authorization = `Bearer ${API_KEY}`
  }
  return config
})
```

### Response Interceptor

Handles errors and logs responses:

```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401, 403, 404, 500, etc.
    return Promise.reject(error)
  }
)
```

---

## Integration with Form Submission

### Dual Submission Strategy

The form submits to both:
1. **Main API** (with Bearer token authentication)
2. **ClickUp API** (optional, if token provided)

**Code Example**:
```javascript
const handleSubmit = async () => {
  // Submit to authenticated API
  const apiResponse = await submitOnboardingForm(formData)
  
  // Submit to ClickUp (optional)
  if (clickupToken) {
    const clickupResponse = await createClickUpTask(formData, clickupToken)
  }
  
  // Show combined success message
}
```

---

## Environment Setup

### Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your API credentials:
   ```env
   VITE_API_KEY=your_actual_api_key
   VITE_API_BASE_URL=https://api.yourdomain.com/v1
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Production

1. Set environment variables on your hosting platform
2. Never include `.env` file in production builds
3. Use your platform's secret management (Vercel, Netlify, etc.)

**Example for Vercel**:
```bash
vercel env add VITE_API_KEY
vercel env add VITE_API_BASE_URL
```

---

## Security Best Practices

### ✅ DO

- Store API keys in `.env` files
- Add `.env` to `.gitignore`
- Use environment variables in production
- Rotate API keys regularly
- Use HTTPS for all API calls
- Implement rate limiting on API server
- Validate all inputs on server-side

### ❌ DON'T

- Commit API keys to Git
- Share API keys in chat/email
- Hardcode API keys in source code
- Use API keys in client-side code (if possible to avoid)
- Log API keys to console in production

---

## Testing API Integration

### Test Connection

Run this in your browser console after the app loads:

```javascript
import { testConnection } from './services/api'

testConnection().then(result => {
  console.log('Connection test:', result)
})
```

### Monitor Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Submit the form
4. Check requests to your API endpoint
5. Verify Authorization header is present

### Check Console Logs

The API service logs all requests and responses:
- Request: method, URL, data
- Response: status, data
- Errors: detailed error information

---

## Customization

### Change Base URL

Edit `.env` file:
```env
VITE_API_BASE_URL=https://your-api.example.com/api/v2
```

### Add Custom Headers

Modify `src/services/api.js`:

```javascript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.0.0',
    'X-Custom-Header': 'value'
  }
})
```

### Add New API Methods

Add to `src/services/api.js`:

```javascript
export const customMethod = async (data) => {
  try {
    const response = await apiClient.post('/custom-endpoint', data)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

---

## Troubleshooting

### Issue: 401 Unauthorized

**Cause**: Invalid or missing API key

**Solution**:
1. Check `.env` file exists
2. Verify `VITE_API_KEY` is set correctly
3. Restart dev server after changing `.env`
4. Check API key hasn't expired

### Issue: CORS Error

**Cause**: API server blocking requests from your domain

**Solution**:
1. Configure CORS on your API server
2. Add your domain to allowed origins
3. Check API server documentation

### Issue: Network Request Failed

**Cause**: API server unreachable or timeout

**Solution**:
1. Check `VITE_API_BASE_URL` is correct
2. Verify API server is running
3. Check network connectivity
4. Increase timeout in `api.js` if needed

### Issue: Environment Variables Not Working

**Cause**: Vite requires prefix `VITE_` for client-side variables

**Solution**:
1. Ensure variables start with `VITE_`
2. Restart dev server after changes
3. Variables without `VITE_` prefix won't work

---

## API Key Rotation

If your API key is compromised:

1. Generate new key from your API provider
2. Update `.env` file with new key
3. Update production environment variables
4. Invalidate old key on API server
5. Test new key works correctly

---

## Support

For API integration issues:
1. Check browser console for errors
2. Review Network tab in DevTools
3. Check `src/services/api.js` configuration
4. Verify environment variables are set
5. Contact API provider for server-side issues
