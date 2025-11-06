# Quick Start Guide

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
cd edi-onboarding-form
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: http://localhost:5173

That's it! The EDI Vendor Onboarding Form should now be running.

## What You'll See

### Section 1: Company & Contact Information
A professional onboarding form with:
- Company Name field
- Contact Name field
- Contact Email field
- Contact Phone field
- A "Continue to Transaction Details" button that enables when all fields are filled

### Section 2: EDI Transaction Types & Details
After completing Section 1, you'll see:
- Dropdown to select EDI transaction types from 8 industry categories
- For each selected transaction, configure:
  - Direction (You to Us / Us to You / Both)
  - Frequency (Real-time, Hourly, Daily, etc.)
  - Required or Optional
  - Documentation availability
  - Functional Acknowledgment (997) requirements
- Add/remove multiple transaction types
- Submit button to finalize the form

## Key Features

✅ **Multi-step workflow** - Progress from company info to transaction details
✅ **Edit functionality** - Return to Section 1 to modify your information
✅ **Dynamic forms** - Add multiple EDI transaction types with unique configurations
✅ **Validation** - Buttons enable only when required fields are complete
✅ **Professional UI** - Built with shadcn/ui component patterns
✅ **Responsive** - Works on mobile, tablet, and desktop

## Making Changes

Edit `src/App.jsx` to modify the form logic and structure.
The app will hot-reload automatically when you save changes.

## Building for Production

```bash
npm run build
```

The production files will be created in the `dist` folder.

## Component Architecture

- **Button**: shadcn/ui-style button with variants (default, outline, ghost, link, destructive)
- **Select**: Styled dropdown with focus states and optgroup support
- **Icons**: lucide-react for CircleCheckBig (completion) and Trash2 (delete)
