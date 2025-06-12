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

## Local Development Setup

This project consists of two separate services that must run together:

1.  **Next.js Web App**: The frontend application running on port 3000.
2.  **FastAPI AI Engine**: The Python backend service running on port 8001.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20.x or higher recommended)
- [Python](https://www.python.org/downloads/) (version 3.9 or higher recommended)
- `pip` (Python's package installer)

### Running the Application

1.  **Install JavaScript Dependencies:**
    ```bash
    npm install
    ```

2.  **Install Python Dependencies:**
    The AI engine's dependencies are listed in `apps/ai-engine/requirements.txt`. Install them using pip:
    ```bash
    pip install -r apps/ai-engine/requirements.txt
    ```

3.  **Run Both Services:**
    The `dev` command uses `concurrently` to launch both the web app and the AI engine with a single command.
    ```bash
    npm run dev
    ```

    You should see color-coded logs prefixed with `[WEB]` and `[AI]`. The web application will be available at [http://localhost:3000](http://localhost:3000).

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