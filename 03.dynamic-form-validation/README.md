# Dynamic Form Validation

A React project that demonstrates schema-driven forms, conditional fields, custom validation, and a review-before-submit flow.

## Features

- Schema-driven form fields
- Reusable form handling
- Conditional fields based on account type
- Student-specific fields
- Professional-specific fields
- Required field validation
- Email format validation
- Password length validation
- Dynamic validation for conditional fields
- Review screen before final submission
- Edit form before submit
- Success message after submit
- Form reset after successful submission

## Conditional Logic

If the user selects:

### Student
- College Name
- Course

### Professional
- Company Name
- Experience

## Validation Rules

- Full Name is required
- Email is required
- Email must be valid
- Password is required
- Password must be at least 8 characters
- Account Type is required
- About section is required
- Student users must enter College and Course
- Professional users must enter Company and Experience

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Bun

## Project Structure

```text
src/
├── components/
│   └── Review.jsx
├── data/
│   └── formSchema.js
├── utils/
│   └── validation.js
├── App.jsx
└── index.css


Run Locally
Install dependencies:
bun install

Start development server:
bun run dev

Run ESLint:
bun run lint

Create production build:
bun run build

What I Learned
This project helped me understand:
- How schema-driven forms work
- How to generate inputs dynamically
- How to manage form state with React
- How computed property names work
[name]: value

- How conditional rendering works
- How to validate form data
- How to store validation errors
- How to prevent invalid form submission
- How to create a review step before final submission
- How to separate form schema and validation logic into different files
Form Flow
Form
  ↓
Validation
  ↓
Continue
  ↓
Review Screen
  ↓
Edit or Submit
  ↓
Success

Build Status
- ESLint: Passed
- Production Build: Passed
Future Improvements
- Real backend submission
- Database integration
- Better password validation
- Show/hide password
- Reusable FormField component
- Form persistence
- Better accessibility
- Unit testing