# ClickUp API Integration Guide

## Overview

This application is now integrated with ClickUp to automatically create tasks when users submit the EDI Vendor Onboarding Form. Each submission creates a formatted task in your specified ClickUp list.

## Setup Instructions

### 1. Get Your ClickUp API Token

1. Log in to your ClickUp account
2. Click your avatar in the bottom-left corner
3. Select **Settings**
4. Click **Apps** in the left sidebar
5. Click **Generate** under "API Token" section
6. Copy your API token (it starts with `pk_`)

### 2. Configure the Application

You have two options for configuring your API token:

#### Option A: Environment Variable (Recommended for Production)

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your token:
   ```
   VITE_CLICKUP_API_TOKEN=pk_your_actual_token_here
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

#### Option B: Direct Configuration (Development/Testing Only)

1. Open `src/config/clickup.js`
2. Uncomment the direct configuration line
3. Replace `pk_YOUR_TOKEN_HERE` with your actual token:
   ```javascript
   export const CLICKUP_API_TOKEN = 'pk_your_actual_token_here';
   ```

**⚠️ Warning:** Do not commit your actual token to version control!

#### Option C: Runtime Configuration

If no token is configured, the application will show a secure input field where users can enter their token at runtime. The token is stored in component state only and never persisted.

### 3. Verify ClickUp List ID

The application is configured to create tasks in list ID: **901413221524**

To use a different list:
1. Open `src/config/clickup.js`
2. Update the `CLICKUP_LIST_ID` value
3. The list ID can be found in your ClickUp URL when viewing the list

## How It Works

### Form Submission Flow

1. User fills out Section 1 (Company & Contact Information)
2. User continues to Section 2 (EDI Transaction Types)
3. User configures one or more transaction types
4. User clicks "Submit Onboarding Form"
5. Application validates API token
6. Application creates formatted task in ClickUp
7. User receives success/error feedback

### Task Creation

When a form is submitted, the application creates a ClickUp task with:

**Task Name:**
```
EDI Onboarding: [Company Name]
```

**Task Description (Markdown formatted):**
```markdown
# EDI Vendor Onboarding Form Submission

## Company and Contact Information

**Company Name:** [Company Name]
**Contact Name:** [Contact Name]
**Contact Email:** [Email]
**Contact Phone:** [Phone]

## EDI Transaction Types & Details

### 1. [Transaction Type Name]

- **Direction:** [Direction]
- **Frequency:** [Frequency]
- **Required/Optional:** [Status]

**Documentation & Samples:**
- EDI Implementation Guide: ✅ Yes / ❌ No
- Sample EDI Files: ✅ Yes / ❌ No
- Data Mapping Specifications: ✅ Yes / ❌ No
- Internal System Format Documentation: ✅ Yes / ❌ No

**Functional Acknowledgments (997):**
- Require 997 from us: ✅ Yes / ❌ No
- Will send 997 to us: ✅ Yes / ❌ No

[Additional transactions follow same format]
```

**Task Attributes:**
- Status: `to do`
- Priority: `3` (Normal)
- Tags: `edi-onboarding`, `vendor`

## UI Features

### Loading State

When submitting, the button shows a spinner and displays "Submitting..."

### Success State

After successful submission:
- Green success message displays
- Alert shows task name and ID
- Form data is preserved (can be reset if needed)

### Error Handling

If submission fails:
- Red error message displays with details
- Alert shows error information
- Form data is preserved for retry
- Common errors include:
  - Invalid API token
  - Network issues
  - Invalid list ID
  - Insufficient permissions

### API Token Input

If no token is configured:
- Yellow warning box displays
- Secure password input for token
- Instructions for finding token
- Submit button disabled until token entered

## API Service Details

### File: `src/services/clickup.js`

**Main Function:**
```javascript
createClickUpTask(formData, apiToken)
```

**Parameters:**
- `formData`: Object containing `section1Data` and `selectedTransactions`
- `apiToken`: ClickUp API token string

**Returns:**
- Promise resolving to ClickUp task object
- Contains task ID, name, URL, and other task details

**Helper Functions:**
- `formatTaskDescription()`: Converts form data to Markdown
- `formatValue()`: Formats dropdown values for readability
- `formatYesNo()`: Converts yes/no to emoji checkmarks

### Error Handling

The service handles:
- Network errors
- HTTP error responses
- Invalid tokens
- Malformed data
- API rate limits

## Security Considerations

### Best Practices

1. **Never commit API tokens** to version control
   - Use `.env` file (already in `.gitignore`)
   - Use environment variables in production

2. **Secure token storage**
   - Store in environment variables
   - Use secret management in production (e.g., AWS Secrets Manager)

3. **Token rotation**
   - Periodically rotate your API tokens
   - Update configuration when rotating

4. **Access control**
   - Ensure token has minimum required permissions
   - Use workspace-specific tokens if possible

### Production Deployment

For production environments:

1. **Use environment variables**
   ```bash
   # Example: Vercel
   vercel env add VITE_CLICKUP_API_TOKEN
   
   # Example: Netlify
   netlify env:set VITE_CLICKUP_API_TOKEN pk_your_token
   ```

2. **Never expose tokens in client-side code**
   - Consider using a backend proxy for API calls
   - Implement server-side token management

3. **Monitor API usage**
   - Check ClickUp API rate limits
   - Implement retry logic for rate limit errors

## Troubleshooting

### Common Issues

**Issue: "ClickUp API token is not configured"**
- Solution: Add token to `.env` file or enter at runtime

**Issue: "HTTP error! status: 401"**
- Cause: Invalid or expired API token
- Solution: Generate new token in ClickUp settings

**Issue: "HTTP error! status: 404"**
- Cause: Invalid list ID
- Solution: Verify list ID in ClickUp URL

**Issue: "HTTP error! status: 403"**
- Cause: Insufficient permissions
- Solution: Ensure token has access to the list

**Issue: Network error**
- Cause: CORS or network connectivity
- Solution: Check network, consider backend proxy

### Testing

To test the integration:

1. Configure your API token
2. Fill out the form completely
3. Click "Submit Onboarding Form"
4. Check ClickUp for the created task
5. Verify task contains all form data

### Debug Mode

Enable console logging to see:
- Form data being submitted
- API request details
- Response from ClickUp
- Any errors that occur

## API Rate Limits

ClickUp API has rate limits:
- **100 requests per minute** per token
- **10 requests per second** per token

The application handles rate limit errors and displays appropriate messages.

## Extending the Integration

### Custom Fields

To add ClickUp custom fields:

1. Get custom field IDs from ClickUp
2. Edit `src/services/clickup.js`
3. Add to `custom_fields` array in `taskData`

Example:
```javascript
custom_fields: [
  {
    id: "field_id_here",
    value: section1Data.companyName
  }
]
```

### Additional Task Properties

You can customize:
- `assignees`: Array of user IDs
- `due_date`: Unix timestamp
- `due_date_time`: Boolean for time inclusion
- `time_estimate`: Estimated time in milliseconds
- `start_date`: Unix timestamp
- `notify_all`: Boolean to notify all assignees

### Webhook Integration

For advanced workflows, consider:
- ClickUp webhooks to trigger actions
- Automation rules in ClickUp
- Integration with other tools

## Support

For ClickUp API documentation:
- Official Docs: https://clickup.com/api
- API v2 Reference: https://clickup.com/api/clickupreference/operation/CreateTask/

For application-specific issues:
- Check console for error details
- Review this guide for configuration
- Ensure API token has correct permissions
