# LearnUp Admin Panel - Next.js Frontend

This is the Next.js 14 frontend for the LearnUp Admin Panel, migrated from React/Vite.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Your existing Express backend running on port 3000

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3001](http://localhost:3001)

### Building for Production

```bash
npm run build
npm start
```

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Authentication** with existing Express backend
- **Responsive Design** for all screen sizes

## Project Structure

```
nextjs-frontend/
├── app/                      # App router pages
│   ├── dashboard/           # Dashboard page
│   ├── teacher-sign-in/     # Sign-in page
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/              # Reusable components
│   ├── dashboard/          # Dashboard-specific components
│   └── ui/                 # UI components (shadcn)
├── lib/                    # Utilities and configurations
│   ├── api-client.ts       # API client for backend calls
│   ├── auth-context.tsx    # Authentication context
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## API Integration

The frontend connects to your existing Express backend at `http://localhost:3000`.

Authentication endpoints:
- POST `/api/auth/signin` - Sign in with email and password
- POST `/api/auth/signout` - Sign out

## Authentication Flow

1. User enters credentials on `/teacher-sign-in`
2. Credentials are sent to Express backend
3. Backend validates and returns user data with cookie
4. User is redirected to `/dashboard`
5. Authentication state is managed in AuthContext

## Available Routes

- `/` - Redirects to sign-in
- `/teacher-sign-in` - Authentication page
- `/dashboard` - Main dashboard with query parameter navigation
  - `?tab=profile` - Dashboard view
  - `?tab=transfers` - Mutual transfers
  - `?tab=grade` - Grade management
  - `?tab=medium` - Medium management
  - `?tab=districts` - Districts management
  - `?tab=zones` - Zones management
  - And more academic and registration tabs...

## Notes

- The backend must be running on port 3000
- Frontend runs on port 3001 to avoid conflicts
- CORS is configured in the backend to allow requests from localhost:3001
- Sessions are managed via HTTP-only cookies from the Express backend
