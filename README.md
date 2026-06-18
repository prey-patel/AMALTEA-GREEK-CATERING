# Aegean Greek Catering

Aegean Greek Catering provides premium Mediterranean and Greek catering services. This repository contains the frontend single-page application built with React, Vite, Tailwind CSS, Framer Motion, and dynamic PDF 3D flipbook capabilities, backed by Supabase backend services.

## Tech Stack
* **Frontend**: React 19, Vite 6, Tailwind CSS v4, Framer Motion
* **Database & Storage**: Supabase (PostgreSQL)
* **Auth**: Supabase Auth
* **SMTP Transactions**: Brevo (via Supabase Edge Functions)
* **Hosting**: Vercel

## Local Development Setup

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3. Install & Run
Install dependencies and start the local dev server:
```bash
npm install
npm run dev
```

The app will start on `http://localhost:3000`.

## Scripts
* `npm run dev`: Starts local development server.
* `npm run build`: Bundles the application for production.
* `npm run lint`: Performs typechecking and lint checks.
* `npm run test`: Runs the test suite via Vitest.
