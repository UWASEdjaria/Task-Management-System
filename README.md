## Task Management System (Frontend)

A frontend-only task management web app built with Next.js 16, featuring a complete user authentication UI and a dashboard. All pages are interactive and validated with Zod, providing a high-fidelity prototype for a task management platform.

# Tech Stack

Framework: Next.js 16 (App Router, Turbopack)

Forms & Validation: React Hook Form + Zod

Styling: Tailwind CSS

## State Management: React (useState, useEffect)

# Features

# 🔐 User Authentication UI

Sign Up / Login: Interactive forms with real-time validation.

OTP Flow: Dedicated pages for Verify OTP and Resend OTP.

Password Recovery: Forgot Password and Reset Password layouts.

# 📊 Dashboard UI

Task Overview: Clean layout for managing daily activities.

Placeholders: Visual status trackers and task list components.

Responsive Design: Fully optimized for Mobile, Tablet, and Desktop.

# Project Structure

src/
├── app/
│   ├── auth/            # Auth pages (login, signup, verify, forgot, resend)
│   ├── dashboard/       # Dashboard pages and task layouts
│   └── page.tsx         # Home / Landing page
├── components/          # Shared UI components (Buttons, Inputs, Cards)
├── hooks/               # Custom React hooks for UI logic
└── lib/
    └── validations.ts   # Zod schemas for form safety


# 🚀 Getting Started

# Prerequisites

Node.js 18+ installed on your machine.

# Setup Instructions

Clone the repository and install dependencies:

npm install


Start the development server:

npm run dev


# View the application:
Open http://localhost:3000 in your browser to see the results.

# 🛠 Scripts

# Command

# Description

npm run dev

# Start development server 

npm run build

# Build the application for production

npm run start

# Start the production server

npm run lint

Run ESLint to check for code quality