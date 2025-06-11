export type Link = {
    id: string;
    title: string;
    ai_summary: string;
    url: string;
    tags: string[];
    imageUrl?: string;
    created_at: string;
};

export type LinkWithContent = {
  id: string;
  created_at: string;
  user_id: string;
  url: string;
  title: string | null;
  description: string | null;
  site_name: string | null;
  main_image_url: string | null;
  status: "pending" | "processing" | "processed" | "failed";
  tags?: string[];
  ai_summary?: string;
  link_content: {
    content_raw_text: string | null;
    content_summary: string | null;
    // Embeddings can be complex, 'any' is a safe bet for now
    content_embedding: any; 
  }[] | null;
}; 