# Blob Frontend

AI-powered workforce intelligence dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React (icons)
- **Backend Integration**: Supabase (auth) + custom API
- **Charts**: Recharts

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Update the following in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (default: http://localhost:8000)

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Dashboard pages
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── not-found.tsx        # 404 page
├── components/
│   └── layout/              # Layout components (navbar, sidebar)
├── lib/
│   ├── api.ts              # API client wrapper
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # Utility functions
└── types/
    └── index.ts            # TypeScript type definitions
```

## Features

### Dashboard
- Company-wide engagement metrics
- Employee directory with filtering
- Individual employee profiles with detailed analytics
- Department performance tracking

### Programs
- Wellness program management
- Progress tracking and enrollment
- Program creation and configuration

### Trophies
- Achievement catalog and leaderboards
- Trophy awards and recognition system

### Feed
- Real-time event timeline
- Engagement alerts and notifications
- Trend analysis and insights

### Analytics
- Reporting and data analysis
- Predictive insights
- Scenario planning tools

### Settings
- Company configuration
- Integration management (Slack, Teams, Google Workspace, etc.)
- Timezone and currency settings

## Design System

### Brand Colors
- **Primary (Blob Green)**: `#10B981`
- **Dark Navy (Sidebar)**: `#0F172A`
- **Darker**: `#020617`
- **Surface**: `#1E293B`
- **Border**: `#334155`

### Layout
- **Top Navbar**: Fixed, 64px height, white background
- **Left Sidebar**: Fixed, 256px width (collapsible to 80px), dark background
- **Main Content**: Responsive grid with consistent padding

## Components

### TopNavbar
- Logo, greeting, and user info
- Search bar (placeholder)
- Notifications and messages
- User profile dropdown

### LeftSidebar
- Navigation menu with active state
- Watchlist section
- Blob GPT card
- Collapse/expand functionality
- Sign out button

### DashboardLayout
- Combines TopNavbar and LeftSidebar
- Manages collapse state
- Main content area with proper margins

## API Integration

The app uses a custom API client (`lib/api.ts`) that:
- Automatically includes Supabase auth token
- Handles common HTTP methods (GET, POST, PUT, DELETE)
- Manages errors gracefully

Example usage:
```typescript
import { api } from '@/lib/api'

// GET request
const data = await api.get('/employees')

// POST request
const result = await api.post('/programs', { name: 'New Program' })
```

## Authentication

Authentication is handled via Supabase. Configure credentials in `.env.local`:
- Users can sign in with email/password or OAuth (Google, Microsoft)
- Session tokens are automatically included in API requests

## Development Guidelines

- Use TypeScript for type safety
- Follow the existing component structure
- Use Tailwind CSS for styling (avoid inline styles)
- Implement proper loading and error states
- Create reusable components in `src/components/`
- Define types in `src/types/index.ts`

## Common Tasks

### Adding a New Page
1. Create directory in `src/app/(dashboard)/`
2. Add `page.tsx` with "use client" directive
3. Page will auto-route based on file location

### Adding a New API Endpoint Call
1. Use the `api` client from `lib/api.ts`
2. Add TypeScript types to `types/index.ts`
3. Handle loading/error states with React hooks

### Updating Styles
- Update Tailwind config in `tailwind.config.ts`
- Use brand colors: `bg-blob-primary`, `bg-blob-dark`, etc.
- Maintain consistent spacing and shadows

## Performance

- Image optimization via Next.js Image component
- Code splitting via App Router
- CSS minimization via Tailwind
- API response caching (implementation pending)

## Deployment

The app can be deployed to Vercel, Netlify, or any Node.js host:

```bash
npm run build
```

Ensure environment variables are set in your hosting platform.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Lucide Icons](https://lucide.dev)

## Support

For issues or questions, contact the development team.
