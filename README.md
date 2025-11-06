# EDI Vendor Onboarding Form

A React + Vite application featuring a comprehensive EDI (Electronic Data Interchange) vendor onboarding form with multi-step workflow, API integration with Bearer token authentication, and dual submission to both main API and ClickUp.

## Features

- **Multi-Step Form**: Two-section wizard with progress tracking
- **API Integration**: Full REST API integration with Bearer token authentication
- **Axios HTTP Client**: Professional API service with request/response interceptors
- **Dual Submission**: Submit to both main API and ClickUp simultaneously
- **Draft Save**: Auto-save drafts with API persistence
- **React State Management**: Uses React hooks (useState) for form data management
- **Form Validation**: Real-time validation that enables/disables buttons
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS
- **shadcn/ui Components**: Professional UI components with Button and Select
- **Transaction Management**: Add, configure, and remove EDI transaction types
- **Security**: Environment-based API key management
- **Error Handling**: Comprehensive error handling with user feedback

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- An API key for authentication

## Installation

1. Navigate to the project directory:
```bash
cd edi-onboarding-form
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your API credentials:
```env
VITE_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://api.yourdomain.com/v1
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` folder.

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
edi-onboarding-form/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── button.jsx      # shadcn-style Button component
│   │       └── select.jsx      # shadcn-style Select component
│   ├── services/
│   │   ├── api.js              # API service with Axios (NEW!)
│   │   └── clickup.js          # ClickUp integration
│   ├── config/
│   │   └── clickup.js          # ClickUp configuration
│   ├── lib/
│   │   └── utils.js            # Utility functions (cn helper)
│   ├── App.jsx                 # Main form component with multi-step logic
│   ├── App.css                 # Component styles
│   ├── index.css               # Tailwind directives
│   └── main.jsx                # Application entry point
├── .env                        # Environment variables (DO NOT COMMIT!)
├── .env.example                # Environment template (safe to commit)
├── public/                     # Static assets
├── index.html                  # HTML template
├── package.json                # Project dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## API Integration

### Authentication

All API requests include Bearer token authentication:
```javascript
Authorization: Bearer YOUR_API_KEY
```

This is handled automatically by the Axios interceptor in `src/services/api.js`.

### Available API Methods

1. **submitOnboardingForm(formData)** - Submit complete form
2. **saveDraft(formData)** - Save incomplete form as draft
3. **getTransactionTypes()** - Get available transaction types
4. **validateCompanyInfo(data)** - Validate company information
5. **getOnboarding(id)** - Retrieve existing onboarding
6. **updateOnboarding(id, data)** - Update existing onboarding
7. **testConnection()** - Test API connectivity

### Usage Example

```javascript
import { submitOnboardingForm } from './services/api'

const result = await submitOnboardingForm(formData)
if (result.success) {
  console.log('Submitted:', result.data)
} else {
  console.error('Error:', result.error)
}
```

See **[API_INTEGRATION.md](API_INTEGRATION.md)** for complete API documentation.

## Form Structure

### Section 1: Company and Contact Information
- **Company Name** (required)
- **Contact Name** (required)
- **Contact Email** (required)
- **Contact Phone** (required)

All fields must be filled before continuing to Section 2. Once completed, this section displays as a summary with an "Edit" button.

### Section 2: EDI Transaction Types & Details

For each selected transaction type, configure:
- **Direction**: You send to us / We send to you / Both
- **Frequency**: Real-time / Hourly / Daily / Weekly / Monthly / On-demand
- **Required or Optional**
- **Documentation & Samples**:
  - EDI implementation guide availability
  - Sample EDI files availability
  - Data mapping specifications
  - Internal system format documentation
- **Functional Acknowledgments (997)**:
  - 997 requirement from us
  - 997 sending capability

### Form Actions

- **Save Draft**: Saves current form state to API (with authentication)
- **Submit**: Submits to both main API and ClickUp (if configured)

## Transaction Types Available

The form includes comprehensive EDI transaction types grouped by industry:
- **Retail & Consumer Goods**: 810 Invoice, 850 PO, 856 ASN, etc. (11 types)
- **Transportation & Logistics**: 204 Load Tender, 214 Shipment Status, etc. (11 types)
- **Healthcare**: 270/271 Eligibility, 837 Claim, 835 Payment, etc. (10 types)
- **Manufacturing**: 830 Planning Schedule, 862 Shipping Schedule, etc. (9 types)
- **Automotive**: 866 Production Sequence, 867 Product Transfer, etc. (7 types)
- **Finance & Banking**: 820 Payment Order, 821 Financial Reporting, etc. (7 types)
- **Government**: 840 RFQ, 843 RFQ Response, etc. (6 types)
- **Grocery & Food Service**: 875 Invoice, 876 PO, 880 Item Maintenance, etc. (7 types)

**Total**: 68 transaction types across 8 industries

## Technologies Used

- **React 18**: Frontend library
- **Vite**: Build tool and development server
- **Axios 1.7.9**: HTTP client for API requests
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui pattern**: Component architecture with Button and Select
- **lucide-react**: Icon library (CircleCheckBig, Trash2, Loader2)
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing
- **clsx & tailwind-merge**: Utility for className management

## Security

### API Key Protection

⚠️ **IMPORTANT**: Never commit your `.env` file to version control!

The `.env` file is already listed in `.gitignore`. Your API keys are:
- Loaded from environment variables
- Never hardcoded in source code
- Automatically added to requests via Axios interceptor

**See [SECURITY.md](SECURITY.md) for complete security best practices.**

### Environment Variables

Required variables in `.env`:
```env
VITE_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://api.yourdomain.com/v1
```

Optional (for ClickUp integration):
```env
VITE_CLICKUP_API_TOKEN=your_clickup_token
VITE_CLICKUP_LIST_ID=your_list_id
```

## Customization

### Styling
The form uses Tailwind CSS classes. Customize colors, spacing, and other styles by:
- Modifying classes in `App.jsx`
- Extending Tailwind configuration in `tailwind.config.js`
- Updating component variants in `src/components/ui/`

### API Endpoints
Edit `src/services/api.js` to:
- Change base URL
- Add custom headers
- Modify timeout settings
- Add new API methods

### Form Logic
Form validation and state management can be customized in `App.jsx`. The multi-step workflow tracks:
- Current step (1 or 2)
- Section 1 data (company/contact info)
- Selected transactions array with all details

### Adding More Transaction Types
Edit the `transactionTypes` array in `App.jsx` to add new categories or transaction options.

## Documentation

- **[README.md](README.md)** - This file (overview and getting started)
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - Complete API documentation
- **[SECURITY.md](SECURITY.md)** - Security best practices and API key management
- **[FEATURES.md](FEATURES.md)** - Detailed feature documentation
- **[QUICKSTART.md](QUICKSTART.md)** - 3-step quick start guide
- **[VISUAL_GUIDE.md](VISUAL_GUIDE.md)** - UI/UX visual description

## Deployment

### Vercel
```bash
vercel env add VITE_API_KEY
vercel env add VITE_API_BASE_URL
vercel deploy
```

### Netlify
```bash
netlify env:set VITE_API_KEY "your_key"
netlify env:set VITE_API_BASE_URL "your_url"
netlify deploy
```

### Docker
```bash
docker build -t edi-onboarding .
docker run -e VITE_API_KEY="your_key" -p 3000:3000 edi-onboarding
```

See deployment platform documentation for specific instructions.

## Troubleshooting

### API Connection Issues

**401 Unauthorized**: Check your API key in `.env`
**CORS Errors**: Configure CORS on your API server
**Network Timeout**: Increase timeout in `src/services/api.js`

### Environment Variables Not Working

1. Ensure variables start with `VITE_` prefix
2. Restart dev server after changing `.env`
3. Check `.env` file is in project root

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

## Future Enhancements

- Email format validation
- Phone number formatting
- File upload for documentation
- Progress bar between sections
- Form data persistence (localStorage)
- Additional form sections
- Real-time form collaboration
- Success confirmation page
- Form data export/download
- Webhook notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Support

For issues and questions:
1. Check [API_INTEGRATION.md](API_INTEGRATION.md)
2. Review [SECURITY.md](SECURITY.md)
3. Check browser console for errors
4. Review Network tab in DevTools
5. Open an issue on GitHub

---

**Version**: 2.0.0 (with API Integration)
**Last Updated**: October 29, 2025
**React Version**: 18.3.1
**Vite Version**: 7.1.12
**Axios Version**: 1.7.9
