-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies for profiles
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
  
  -- Drop policies for links
  DROP POLICY IF EXISTS "Users can view their own links" ON public.links;
  DROP POLICY IF EXISTS "Users can create their own links" ON public.links;
  DROP POLICY IF EXISTS "Users can update their own links" ON public.links;
  DROP POLICY IF EXISTS "Users can delete their own links" ON public.links;
  
  -- Drop policies for clusters
  DROP POLICY IF EXISTS "Users can view their own clusters" ON public.clusters;
  DROP POLICY IF EXISTS "Users can create their own clusters" ON public.clusters;
  DROP POLICY IF EXISTS "Users can update their own clusters" ON public.clusters;
  DROP POLICY IF EXISTS "Users can delete their own clusters" ON public.clusters;
  
  -- Drop policies for folders
  DROP POLICY IF EXISTS "Users can view their own folders" ON public.folders;
  DROP POLICY IF EXISTS "Users can create their own folders" ON public.folders;
  DROP POLICY IF EXISTS "Users can update their own folders" ON public.folders;
  DROP POLICY IF EXISTS "Users can delete their own folders" ON public.folders;
  
  -- Drop policies for link_clusters
  DROP POLICY IF EXISTS "Users can select their own link_clusters" ON public.link_clusters;
  DROP POLICY IF EXISTS "Users can insert their own link_clusters" ON public.link_clusters;
  DROP POLICY IF EXISTS "Users can delete their own link_clusters" ON public.link_clusters;
  
  -- Drop policies for link_folders
  DROP POLICY IF EXISTS "Users can select their own link_folders" ON public.link_folders;
  DROP POLICY IF EXISTS "Users can insert their own link_folders" ON public.link_folders;
  DROP POLICY IF EXISTS "Users can delete their own link_folders" ON public.link_folders;
  
  -- Drop policies for tags
  DROP POLICY IF EXISTS "Users can view their own tags" ON public.tags;
  DROP POLICY IF EXISTS "Users can create their own tags" ON public.tags;
  DROP POLICY IF EXISTS "Users can update their own tags" ON public.tags;
  DROP POLICY IF EXISTS "Users can delete their own tags" ON public.tags;
  
  -- Drop policies for link_tags
  DROP POLICY IF EXISTS "Users can select their own link_tags" ON public.link_tags;
  DROP POLICY IF EXISTS "Users can insert their own link_tags" ON public.link_tags;
  DROP POLICY IF EXISTS "Users can delete their own link_tags" ON public.link_tags;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors if policies don't exist
    NULL;
END $$;

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for links table
CREATE POLICY "Users can view their own links" ON public.links
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own links" ON public.links
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own links" ON public.links
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own links" ON public.links
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for clusters table
CREATE POLICY "Users can view their own clusters" ON public.clusters
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own clusters" ON public.clusters
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clusters" ON public.clusters
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clusters" ON public.clusters
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for folders table
CREATE POLICY "Users can view their own folders" ON public.folders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own folders" ON public.folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own folders" ON public.folders
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own folders" ON public.folders
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for link_clusters junction table
CREATE POLICY "Users can select their own link_clusters" ON public.link_clusters
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.links WHERE id = link_id
  ));
CREATE POLICY "Users can insert their own link_clusters" ON public.link_clusters
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.links WHERE id = link_id
  ));
CREATE POLICY "Users can delete their own link_clusters" ON public.link_clusters
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM public.links WHERE id = link_id
  ));

-- Create policies for link_folders junction table
CREATE POLICY "Users can select their own link_folders" ON public.link_folders
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.links WHERE id = link_id
  ));
CREATE POLICY "Users can insert their own link_folders" ON public.link_folders
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.links WHERE id = link_id
  ));
CREATE POLICY "Users can delete their own link_folders" ON public.link_folders
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM public.links WHERE id = link_id
  ));

-- Create policies for tags table
CREATE POLICY "Users can view their own tags" ON public.tags
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tags" ON public.tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tags" ON public.tags
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tags" ON public.tags
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for link_tags junction table
CREATE POLICY "Users can select their own link_tags" ON public.link_tags
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.links WHERE id = link_id
  ));
CREATE POLICY "Users can insert their own link_tags" ON public.link_tags
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.links WHERE id = link_id
  ));
CREATE POLICY "Users can delete their own link_tags" ON public.link_tags
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM public.links WHERE id = link_id
  ));

-- Create trigger to update updated_at on all tables
DROP FUNCTION IF EXISTS public.update_updated_at CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_links_updated_at ON public.links;
CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON public.links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_clusters_updated_at ON public.clusters;
CREATE TRIGGER update_clusters_updated_at
  BEFORE UPDATE ON public.clusters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_folders_updated_at ON public.folders;
CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at(); 