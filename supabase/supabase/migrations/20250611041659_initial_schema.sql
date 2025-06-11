-- Initial schema setup for LinkLens
-- Will be implemented in future iterations

-- Users table extension (built on top of Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Links table
CREATE TABLE public.links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  image_url TEXT,
  summary TEXT,
  embedding VECTOR(1536),  -- For OpenAI embeddings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visited TIMESTAMP WITH TIME ZONE
);

-- Clusters table
CREATE TABLE public.clusters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  confidence_score FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Folders table
CREATE TABLE public.folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link-Cluster relationship
CREATE TABLE public.link_clusters (
  link_id UUID REFERENCES public.links ON DELETE CASCADE,
  cluster_id UUID REFERENCES public.clusters ON DELETE CASCADE,
  PRIMARY KEY (link_id, cluster_id)
);

-- Link-Folder relationship
CREATE TABLE public.link_folders (
  link_id UUID REFERENCES public.links ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders ON DELETE CASCADE,
  PRIMARY KEY (link_id, folder_id)
);

-- Tags table
CREATE TABLE public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  UNIQUE (user_id, name)
);

-- Link-Tag relationship
CREATE TABLE public.link_tags (
  link_id UUID REFERENCES public.links ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags ON DELETE CASCADE,
  PRIMARY KEY (link_id, tag_id)
);

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";

-- RLS Policies
-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
-- Profiles: users can only see and modify their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Links: users can only see and modify their own links
CREATE POLICY "Users can view their own links" ON public.links
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own links" ON public.links
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own links" ON public.links
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own links" ON public.links
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables...
-- Create trigger to update updated_at on all tables
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON public.links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_clusters_updated_at
  BEFORE UPDATE ON public.clusters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at(); 