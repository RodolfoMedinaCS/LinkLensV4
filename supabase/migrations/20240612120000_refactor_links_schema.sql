-- Supabase Migration: Refactor Links Schema for Rich Metadata and Vector Search

-- This migration assumes the 'pgvector' extension is enabled in your Supabase project.
-- You can enable it in the Supabase Dashboard under Database > Extensions.

-- Step 1: Create the link_content table for heavy data
CREATE TABLE public.link_content (
    link_id UUID PRIMARY KEY REFERENCES public.links(id) ON DELETE CASCADE,
    main_content_text TEXT,
    main_content_html TEXT,
    structured_data_json JSONB,
    raw_html TEXT
);

COMMENT ON TABLE public.link_content IS 'Stores bulky text and JSON data related to a link, to keep the main links table lean.';
COMMENT ON COLUMN public.link_content.link_id IS 'Foreign key to the links table.';
COMMENT ON COLUMN public.link_content.main_content_text IS 'Cleaned, readable text-only version of the main article content from readability-lxml.';
COMMENT ON COLUMN public.link_content.main_content_html IS 'Sanitized HTML of the main article content from readability-lxml.';
COMMENT ON COLUMN public.link_content.structured_data_json IS 'A JSONB field to store extracted structured data like JSON-LD, OpenGraph, etc.';
COMMENT ON COLUMN public.link_content.raw_html IS 'The complete raw HTML of the page, for potential reprocessing or debugging.';

ALTER TABLE public.link_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own link content" ON public.link_content
    FOR ALL
    USING (auth.uid() = (SELECT user_id FROM public.links WHERE id = link_id))
    WITH CHECK (auth.uid() = (SELECT user_id FROM public.links WHERE id = link_id));

-- Step 2: Create the link_embeddings table for semantic search
CREATE TABLE public.link_embeddings (
    id BIGSERIAL PRIMARY KEY,
    link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding VECTOR(1536) NOT NULL, -- Dimension for OpenAI's 'text-embedding-ada-002'
    UNIQUE (link_id, chunk_index)
);

COMMENT ON TABLE public.link_embeddings IS 'Stores text chunks and their corresponding vector embeddings for semantic search.';
COMMENT ON COLUMN public.link_embeddings.embedding IS 'Vector embedding for the text chunk, dimension sized for OpenAI text-embedding-ada-002.';

-- Create an index for fast cosine similarity search on the embeddings
-- This is crucial for performance of the semantic search functionality.
CREATE INDEX ON public.link_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

ALTER TABLE public.link_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read embeddings for their own links" ON public.link_embeddings
    FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM public.links WHERE id = link_id));


-- Step 3: Alter the existing links table
-- Remove columns that are being replaced by the new tables.
ALTER TABLE public.links
DROP COLUMN IF EXISTS summary,
DROP COLUMN IF EXISTS embedding;

-- Add new columns for lightweight, scraped metadata.
ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS site_name TEXT,
ADD COLUMN IF NOT EXISTS lang VARCHAR(10),
ADD COLUMN IF NOT EXISTS favicon_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

COMMENT ON COLUMN public.links.status IS 'The processing status of the link (e.g., pending, processed, failed).'; 