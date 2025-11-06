# Multi-Step EDI Onboarding Form - Visual Guide

## Overall Layout
The form is presented in a white card with rounded corners and shadow, centered on a light gray background. The form header and both sections are contained within this card.

## Header (Always Visible)
- **Title**: "EDI Vendor Onboarding Form" 
  - Large (text-3xl), bold, dark gray
- **Subtitle**: "Complete EDI Transaction Setup"
  - Smaller, medium gray
- Both centered above the form sections

---

## Section 1: Company and Contact Information

### Active State (Step 1)
**Header:**
- Light gray background
- "Section 1: Company and Contact Information" in bold
- No icons or buttons

**Form Fields:**
- White background
- Four input fields with labels:
  1. Company Name (full width)
  2. Contact Name (left column on desktop)
  3. Contact Email (right column on desktop)
  4. Contact Phone (full width)
- All labels show asterisk (*) for required
- Inputs have gray borders with blue focus rings
- Placeholder text in light gray

**Button:**
- "Continue to Transaction Details"
- Right-aligned
- Disabled state: Gray background, gray text
- Enabled state: Blue background, white text, hover effect

### Completed State (Step 2)
**Header:**
- Light gray background
- Section title with green checkmark icon (CircleCheckBig) next to it
- Blue "Edit" link button on the right

**Summary Display:**
- Light gray background
- 2x2 grid layout:
  - Top left: "Company: [value]"
  - Top right: "Contact: [value]"
  - Bottom left: "Email: [value]"
  - Bottom right: "Phone: [value]"
- Labels in medium gray, values in dark gray

---

## Section 2: EDI Transaction Types & Details (Step 2 Only)

### Header
- Light gray background
- "Section 2: EDI Transaction Types & Details" in bold
- No icons

### Transaction Type Selector
- Full-width dropdown
- Label: "Select Transaction Types *"
- Placeholder: "-- Select a transaction type to add --"
- Grouped options by industry (8 optgroups)
- Gray border with blue focus ring

### Selected Transactions Area
**Section Header:**
- "Selected Transaction Types:" in bold, large text

**Transaction Cards:**
Each selected transaction appears in a light blue card (bg-blue-50):

**Card Header:**
- Transaction name in blue-900 (e.g., "810 - Invoice")
- Red trash icon (Trash2) on the right for deletion

**Configuration Fields (within each card):**
All dropdowns styled consistently with gray borders:

1. **Direction** dropdown
   - Options: You send to us / We send to you / Both

2. **Frequency** dropdown
   - Options: Real-time / Hourly / Daily / Weekly / Monthly / On-demand

3. **Required or Optional** dropdown
   - Options: Required / Optional

---

**Documentation & Samples Section:**
- Separated by thin blue border line (border-blue-300)
- Subsection header: "Documentation & Samples:"
- Four yes/no dropdowns:
  1. EDI implementation guide availability
  2. Sample EDI files availability (with helper text)
  3. Data mapping specifications
  4. Internal system format documentation

**Helper Text Example:**
- "Valid, invalid, and edge case examples if available"
- Small, gray text (text-xs) below sample files dropdown

---

**Functional Acknowledgments Section:**
- Separated by thin blue border line
- Subsection header: "Functional Acknowledgments (997):"
- Two yes/no dropdowns:
  1. 997 requirement from us (with helper text)
  2. 997 sending capability (with helper text)

**Helper Text Examples:**
- "If you send this transaction to us, do you need us to send you a 997?"
- "If we send this transaction to you, will you send us a 997?"

---

### Submit Button (Bottom of Page)
- Center-aligned
- Large size (px-8 py-3)
- Blue background
- White text: "Submit Onboarding Form"
- Drop shadow with enhanced shadow on hover

---

## Color Palette

### Backgrounds
- Page: #f3f4f6 (gray-100)
- Card: #ffffff (white)
- Section headers: #f9fafb (gray-50)
- Transaction cards: #eff6ff (blue-50)

### Text
- Primary headings: #1f2937 (gray-800)
- Body text: #374151 (gray-700)
- Helper text: #6b7280 (gray-500)
- Transaction headers: #1e3a8a (blue-900)

### Accents
- Primary action: #2563eb (blue-600)
- Hover: #1d4ed8 (blue-700)
- Success icon: #22c55e (green-500)
- Danger: #ef4444 (red-500)

### Borders
- Default: #d1d5db (gray-300)
- Focus ring: #3b82f6 (blue-500)
- Transaction card: #bfdbfe (blue-200)
- Section dividers: #93c5fd (blue-300)

---

## Spacing & Layout

### Desktop View (md breakpoint and up)
- Max container width: 4xl (896px)
- Padding: p-8 on main card
- Section padding: p-4 (headers), p-6 (content)
- Transaction card padding: p-4
- Grid gap: gap-4

### Mobile View
- Full width with side padding (px-4)
- All fields stack vertically
- Contact Name/Email stack instead of side-by-side
- Same padding within cards

### Typography Sizes
- Page title: text-3xl (30px)
- Section headings: text-xl (20px)
- Subsection headings: text-lg (18px)
- Form labels: text-sm (14px)
- Helper text: text-xs (12px)

---

## Interactive States

### Inputs
- Default: Gray border
- Focus: Blue ring (ring-2 ring-blue-500)
- Hover: (same as default)

### Buttons
- **Primary (Continue/Submit)**
  - Default enabled: Blue bg, white text
  - Hover: Darker blue
  - Disabled: Gray bg, gray text, not-allowed cursor
  
- **Link (Edit)**
  - Default: Blue text
  - Hover: Darker blue, underline

- **Icon (Delete)**
  - Default: Red
  - Hover: Darker red

### Dropdowns
- Default: Gray border
- Focus: Blue ring
- Open: Browser default dropdown styling

---

## Responsive Behavior

### Section 1 Grid
- **Desktop**: 2 columns for Contact Name/Email
- **Mobile**: Single column, all fields stacked

### Section 2
- **All screen sizes**: Single column
- Transaction cards maintain same layout
- Dropdowns remain full-width

### Buttons
- **Desktop**: Right-aligned (Section 1), center-aligned (Submit)
- **Mobile**: Same alignment, full button width on very small screens

---

## Icon Usage

### CircleCheckBig (lucide-react)
- Size: 24px
- Color: Green (#22c55e)
- Location: Next to Section 1 title when completed
- Purpose: Visual confirmation of section completion

### Trash2 (lucide-react)
- Size: 18px
- Color: Red (#ef4444)
- Location: Top-right of each transaction card
- Purpose: Remove transaction button
- Hover: Darker red

---

## Visual Hierarchy

### Primary Level
1. Page title (largest)
2. Section headings (large, bold)

### Secondary Level
3. Subsection headings (medium, bold)
4. Transaction type names (medium, colored)

### Tertiary Level
5. Form labels (small, medium weight)
6. Field values in summary (small, normal)
7. Helper text (smallest, light gray)

### Action Items
8. Primary buttons (large, bold, blue)
9. Secondary actions (smaller, text-only or outline)
10. Danger actions (red color)
