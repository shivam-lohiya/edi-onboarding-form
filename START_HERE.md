# 👋 START HERE - EDI Onboarding Form with API Integration

Welcome! This is your complete React + Vite EDI onboarding form with **full API integration using Axios and Bearer token authentication**.

## ⚡ Quick Start (5 Steps)

### 1. Install Dependencies
```bash
cd edi-onboarding-form
npm install
```

This installs React, Vite, **Axios**, Tailwind CSS, and all other dependencies.

### 2. Create Environment File
```bash
cp .env.example .env
```

### 3. Add Your API Key
Edit `.env` file:
```env
VITE_API_KEY=your_new_api_key_here
VITE_API_BASE_URL=https://api.yourdomain.com/v1
```

⚠️ **IMPORTANT**: The API key shared in our chat was exposed. Generate a NEW key from your API provider!

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open in Browser
Visit: http://localhost:5173

---

## 🆕 What's New - API Integration

### Axios HTTP Client
- Professional API service with interceptors
- Automatic Bearer token authentication
- Comprehensive error handling
- Request/response logging

### API Methods Available
- `submitOnboardingForm()` - Submit complete form
- `saveDraft()` - Save draft with auto-save
- `getTransactionTypes()` - Fetch transaction types
- `validateCompanyInfo()` - Validate company data
- `testConnection()` - Test API health

### Dual Submission
The form now submits to:
1. **Your API** (with authentication) ✅
2. **ClickUp** (optional) ✅

### Save Draft Feature
New button to save incomplete forms to your API!

---

## 🎯 What the App Does

### Section 1: Company Information
- Fill in company and contact details
- Validation ensures all fields complete
- Progress to Section 2
- Edit anytime with summary view

### Section 2: Transaction Management
- **Select from 68 EDI transaction types**
- 8 industry categories:
  - Retail & Consumer Goods
  - Transportation & Logistics
  - Healthcare
  - Manufacturing
  - Automotive
  - Finance & Banking
  - Government
  - Grocery & Food Service

- **Configure each transaction** with:
  - Direction (You to Us / Us to You / Both)
  - Frequency (Real-time to On-demand)
  - Required or Optional
  - 4 documentation fields
  - 2 acknowledgment fields

### Form Actions
- **Save Draft** → Saves to API (authenticated)
- **Submit** → Dual submission to API + ClickUp

---

## 📦 Project Structure

```
edi-onboarding-form/
├── src/
│   ├── services/
│   │   ├── api.js          ← NEW! Axios API service
│   │   └── clickup.js      ← ClickUp integration
│   ├── components/ui/
│   │   ├── button.jsx      ← shadcn Button
│   │   └── select.jsx      ← shadcn Select
│   ├── lib/
│   │   └── utils.js        ← Utilities
│   ├── App.jsx             ← Main form (updated!)
│   └── ...
├── .env                    ← Your API key (create this!)
├── .env.example            ← Template (provided)
└── ...
```

---

## 🔒 Security Notice

### ⚠️ API Key Exposed!

The API key shared in our conversation:
```
pk_82243107_ZTM4488GLERKVNOKQ8UBSO1F4SSQLJNO
```

**This key was exposed and MUST be rotated immediately!**

### How to Rotate

1. Generate new API key from your provider
2. Update `.env` file with new key
3. Update production environment variables
4. Invalidate old key
5. Test new key works

See **[SECURITY.md](SECURITY.md)** for detailed instructions.

### Security Best Practices

✅ **DO**:
- Keep `.env` file local (never commit)
- Use environment variables in production
- Rotate keys regularly
- Monitor API usage

❌ **DON'T**:
- Commit `.env` to Git (already protected)
- Share API keys in chat/email
- Hardcode keys in source code
- Use same key for dev/prod

---

## 📚 Documentation

### Quick Start
→ **[QUICKSTART.md](QUICKSTART.md)** - Get running fast

### API Integration
→ **[API_INTEGRATION.md](API_INTEGRATION.md)** - Complete API docs

### Security
→ **[SECURITY.md](SECURITY.md)** - Security best practices

### Features
→ **[FEATURES.md](FEATURES.md)** - Detailed features

### Complete Guide
→ **[README.md](README.md)** - Full documentation

### Visual Guide
→ **[VISUAL_GUIDE.md](VISUAL_GUIDE.md)** - UI/UX description

### Summary
→ **[COMPLETE_SUMMARY.md](COMPLETE_SUMMARY.md)** - Everything at a glance

---

## 🛠️ Technology Stack

### Core
- **React 18.3.1** - UI library
- **Vite 7.1.12** - Build tool
- **Axios 1.7.9** - HTTP client (NEW!)

### Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **shadcn/ui pattern** - Component architecture

### Icons
- **lucide-react** - CircleCheckBig, Trash2, Loader2

### Utilities
- **clsx** - Conditional classes
- **tailwind-merge** - Class merging

---

## 🔧 Available Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🎨 Key Features

### Multi-Step Workflow
✅ Section 1 → Section 2
✅ Edit Section 1 anytime
✅ Summary view when complete
✅ All data preserved

### API Integration
✅ Bearer token authentication
✅ Axios with interceptors
✅ Error handling
✅ Success/error feedback
✅ Loading states

### Form Management
✅ 68 transaction types
✅ Add/remove transactions
✅ 10 config fields per transaction
✅ Real-time validation
✅ Draft saving

### Professional UI
✅ Clean modern design
✅ Responsive layout
✅ Loading indicators
✅ Success animations
✅ Error messages

---

## 💡 Next Steps

### 1. Security First
- [ ] Rotate the exposed API key
- [ ] Create `.env` file locally
- [ ] Never commit `.env` to Git
- [ ] Read [SECURITY.md](SECURITY.md)

### 2. Setup & Test
- [ ] Run `npm install`
- [ ] Configure `.env` file
- [ ] Run `npm run dev`
- [ ] Test form submission
- [ ] Verify API connection

### 3. Customize
- [ ] Update API endpoints if needed
- [ ] Customize transaction types
- [ ] Adjust styling if desired
- [ ] Add additional features

### 4. Deploy
- [ ] Set environment variables on platform
- [ ] Run production build
- [ ] Test in production
- [ ] Monitor API usage

---

## 🚨 Troubleshooting

### API Not Working?

**401 Unauthorized**:
- Check API key in `.env`
- Ensure `VITE_` prefix used
- Restart dev server

**CORS Error**:
- Configure CORS on API server
- Check API server documentation

**Network Timeout**:
- Verify API URL correct
- Check API server is running
- Increase timeout in `api.js`

### Environment Variables Not Loading?

1. Must start with `VITE_` prefix
2. Restart dev server after changes
3. Check `.env` file in project root
4. Verify no typos in variable names

### Build Errors?

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

---

## 📞 Get Help

### Read Documentation
1. [API_INTEGRATION.md](API_INTEGRATION.md) - API reference
2. [SECURITY.md](SECURITY.md) - Security guide
3. [README.md](README.md) - Complete docs
4. [FEATURES.md](FEATURES.md) - Feature details

### Debug Tools
1. Browser Console (F12) - Check errors
2. Network Tab - Monitor API calls
3. Application Logs - Review requests

### Check Configuration
1. `.env` file exists and configured
2. Environment variables loaded
3. API key valid and not expired
4. API server accessible

---

## 🎉 You're Ready!

Everything is set up:
- ✅ Multi-step form
- ✅ API integration with Axios
- ✅ Bearer token authentication
- ✅ Dual submission (API + ClickUp)
- ✅ Save draft functionality
- ✅ 68 transaction types
- ✅ Professional UI
- ✅ Complete documentation
- ✅ Security best practices

**Just need to**:
1. Rotate the API key
2. Install dependencies
3. Configure `.env`
4. Run the app

**Let's go! 🚀**

---

**Version**: 2.0.0 with API Integration
**Created**: October 29, 2025
**React**: 18.3.1 | **Vite**: 7.1.12 | **Axios**: 1.7.9
