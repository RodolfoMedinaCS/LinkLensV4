# LinkLens Supabase Setup

This directory contains the Supabase configuration and database schema for the LinkLens application.

## Database Schema

The LinkLens database schema includes the following tables:

- `profiles`: User profiles (extends auth.users)
- `links`: Bookmarked links with metadata and vector embeddings
- `clusters`: AI-generated clusters of related links
- `folders`: User-created folders for organizing links
- `tags`: User-created tags for links
- `link_clusters`: Junction table for link-cluster relationships
- `link_folders`: Junction table for link-folder relationships
- `link_tags`: Junction table for link-tag relationships

## Schema Files

- `migrations/00001_initial_schema.sql`: Contains the table definitions
- `policies.sql`: Contains Row Level Security policies and triggers
- `seed.sql`: Contains sample data for testing

## Setting Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL scripts in this order:
   - `migrations/00001_initial_schema.sql`
   - `policies.sql` 
   - `seed.sql` (optional, for development)
4. Copy your Supabase project URL and anon key from Project Settings > API
5. Update the `.env.local` file in the web app with your credentials

## Environment Variables

The following environment variables are needed for the web application to connect to Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Row Level Security

Row Level Security (RLS) policies are implemented to ensure users can only access their own data:

- Users can only view, edit, and delete their own profiles
- Users can only view, edit, and delete their own links, clusters, folders, and tags
- Junction tables are secured by checking the ownership of related entities

## TypeScript Types

TypeScript types for the database schema are defined in `apps/web/lib/supabase/database.types.ts`. 