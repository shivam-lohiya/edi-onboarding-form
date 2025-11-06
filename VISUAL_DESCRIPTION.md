# Visual Description of the EDI Vendor Onboarding Form

## Layout Overview

The form appears centered on a light gray background (bg-gray-100) with the main content in a white card with rounded corners and shadow.

## Header Section
- **Title**: "EDI Vendor Onboarding Form" 
  - Large, bold, dark gray text (text-3xl font-bold text-gray-800)
- **Subtitle**: "Complete EDI Transaction Setup"
  - Smaller, medium gray text (text-gray-600)
- Both centered with spacing below

## Form Section

### Section Header
- Light gray background (bg-gray-50) with rounded top corners
- Text: "Section 1: Company and Contact Information"
- Large, semi-bold, dark gray (text-xl font-semibold text-gray-800)

### Form Fields Area
- White background with padding
- All fields have:
  - Label above in medium font weight
  - Asterisk (*) indicating required
  - Input box with:
    - Border (gray)
    - Rounded corners
    - Padding inside
    - Blue focus ring when clicked
    - Placeholder text

### Field Layout
1. **Company Name** - Full width input
2. **Contact Name & Email** - Side by side on desktop, stacked on mobile
3. **Contact Phone** - Full width input

### Submit Button
Located at bottom right:
- **When Disabled** (fields empty):
  - Gray background
  - Gray text
  - "cursor-not-allowed" cursor
  - Text: "Continue to Transaction Details"

- **When Enabled** (all fields filled):
  - Blue background (bg-blue-600)
  - White text
  - Hover effect (darker blue)
  - Pointer cursor
  - Text: "Continue to Transaction Details"

## Responsive Behavior

### Desktop (md and up):
- Form width constrained to max-w-3xl
- Contact Name and Email side-by-side in 2-column grid
- Generous padding and spacing

### Mobile:
- Full width with side padding
- All fields stack vertically
- Contact Name and Email stack instead of side-by-side
- Touch-friendly input sizes

## Color Scheme
- **Background**: Light gray (#f3f4f6)
- **Card**: White (#ffffff)
- **Text Primary**: Dark gray (#1f2937)
- **Text Secondary**: Medium gray (#4b5563)
- **Borders**: Light gray (#d1d5db)
- **Focus/Active**: Blue (#3b82f6)
- **Disabled**: Gray (#d1d5db)

## Spacing & Typography
- Consistent padding (p-4, p-6, p-8)
- Vertical spacing between elements (space-y-4, space-y-6)
- Font sizes range from sm to 3xl
- Font weights: normal, medium, semibold, bold

## Professional Features
- Shadow on the main card (shadow-xl)
- Smooth transitions on button hover
- Proper input states (default, focus, disabled)
- Clear visual hierarchy
- Clean, modern aesthetic
