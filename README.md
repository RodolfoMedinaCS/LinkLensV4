# LinkLens - AI-Powered Bookmark Manager

LinkLens is an AI-native bookmark manager that automatically summarizes, clusters, and quality-checks your saved links.

## Features

- **One-Click Capture**: Browser extension scrapes rich metadata the moment a link is saved
- **Smart Summaries**: LLM generates a concise synopsis for every link
- **Semantic Search**: Vector search lets users ask natural-language queries
- **Auto-Clustering**: Automatically groups links by topic with confidence scores
- **Quality Control**: Duplicate and dead-link detection runs continuously

## Project Structure

This project uses a monorepo structure:

- `apps/web`: Next.js frontend with App Router, TypeScript, and Tailwind CSS
- `apps/ai-engine`: Python FastAPI backend for AI processing
- `supabase`: Database migrations, SQL, and storage rules

## Authentication Setup

This project uses Supabase Authentication for user management. Follow these steps to set up authentication:

1. **Environment Variables**

   Copy the `.env.local.example` file to `.env.local` and fill in your Supabase credentials:

   ```
   # Supabase Auth
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. **Authentication Pages**

   The following authentication pages are available:
   - `/auth/login` - Sign in to an existing account
   - `/auth/signup` - Create a new account
   - `/auth/signout` - Server route for signing out

3. **Authentication Flow**

   - Unauthenticated users are redirected to `/auth/login`
   - Authenticated users are redirected to `/dashboard`
   - The authentication state is managed by Supabase Auth and handled by middleware

4. **Social Authentication**

   The auth form supports:
   - Email/Password login
   - Magic link authentication
   - Google OAuth
   - GitHub OAuth

   To enable social authentication, configure the providers in your Supabase dashboard.

## Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to see the application.

## Design System

The project uses the "Focus Terminal" dark theme design system with a color palette focused on:

- Background: #0D1117 (Near Black)
- Card BG: #161B22
- Borders: #21262D
- Primary: #3E63DD (Electric Blue)
- Error: #E5534B
- Muted Text: #8A94A4

## License

MIT 