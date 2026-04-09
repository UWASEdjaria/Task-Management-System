# Task Management System

A full-stack task management web app built with Next.js, Prisma, and PostgreSQL. Includes user authentication with email OTP verification.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Email/password + OTP verification (Nodemailer)
- **Forms:** React Hook Form + Zod validation
- **Styling:** Tailwind CSS

## Features

- User sign up & login
- Email OTP verification
- Forgot / reset password flow
- Resend OTP

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- SMTP credentials for email (Nodemailer)

### Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy `.env` and fill in your values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
```

3. Run database migrations:

```bash
npx prisma migrate dev
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── api/auth/        # Auth API routes (login, signup, OTP, reset)
│   ├── auth/            # Auth pages (login, signup, verify, forgot, resend)
│   └── page.tsx         # Home / landing page
├── components/          # Shared UI components
├── hooks/               # Custom React hooks
└── lib/
    ├── db.ts            # Prisma client
    └── validations.ts   # Zod schemas
prisma/
└── schema.prisma        # Database schema
```
