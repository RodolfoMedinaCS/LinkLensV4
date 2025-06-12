import requests
from bs4 import BeautifulSoup
from readability import Document
from typing import Optional, Dict, Any
import json
from urllib.parse import urljoin, urlparse
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# --- Environment Setup ---
# Load environment variables from .env file in the current directory
load_dotenv()

# Simplified OpenAI Initialization
# This will try to use the new (v1.x+) SDK first, and fall back to the old one.
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
openai_client = None

if OPENAI_API_KEY:
    try:
        from openai import OpenAI
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        print("Initialized OpenAI SDK v1.x+ with API key")
    except ImportError:
        try:
            import openai
            openai.api_key = OPENAI_API_KEY
            print("Initialized OpenAI SDK v0.x (legacy) with API key")
        except Exception as e:
            print(f"Error initializing OpenAI: {e}")
else:
    print("Warning: OPENAI_API_KEY not found. Summarization will be skipped.")

# Use environment variables for secure credential management
SUPABASE_URL = os.environ.get("SUPABASE_URL")
# IMPORTANT: This must be the SERVICE_ROLE_KEY, not the anon key
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Supabase credentials (URL and Service Role Key) not found in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
# --- End Initialization ---

def scrape_and_update_link(link_id: str, url: str):
    """
    Scrapes, summarizes, and updates a link record in a multi-step process.
    """
    print(f"Starting job for link_id: {link_id}, url: {url}")
    scraped_data = None
    try:
        # 1. Scrape website content and metadata
        _update_link_status(link_id, 'scraping')
        response = requests.get(url, headers={'User-Agent': 'LinkLensBot/1.0'}, timeout=20)
        response.raise_for_status()
        scraped_data = _parse_html(url, response.text)
        
        # 2. Update DB with scraped metadata
        _update_database_with_scraped_data(link_id, scraped_data)
        print(f"[{link_id}] Successfully scraped metadata.")

    except requests.RequestException as e:
        status_code = e.response.status_code if hasattr(e, 'response') and e.response else "N/A"
        print(f"Error fetching {url} for link_id {link_id}. Status: {status_code}. Error: {e}")
        _update_link_status(link_id, 'failed')
        return
    except Exception as e:
        print(f"An error occurred during scraping for link_id {link_id}: {e}")
        _update_link_status(link_id, 'failed')
        return

    # Check if main content was extracted successfully
    content_text = scraped_data.get('mainContent', {}).get('text', '')
    if not content_text or len(content_text.strip()) < 100:
        print(f"[{link_id}] Content too short/empty ({len(content_text.strip()) if content_text else 0} chars). Skipping summarization.")
        # Still mark as processed since we got metadata
        _update_link_status(link_id, 'processed')
        return

    try:
        # 3. Generate AI Summary
        if OPENAI_API_KEY and openai_client and scraped_data:
            _update_link_status(link_id, 'summarizing')
            summary = _generate_summary(scraped_data['mainContent']['text'])
            
            # 4. Update DB with summary
            supabase.table('links').update({'ai_summary': summary}).eq('id', link_id).execute()
            print(f"[{link_id}] Successfully generated and saved summary: '{summary[:100]}...'")
        else:
            print(f"[{link_id}] Skipping summarization due to missing OpenAI setup.")
            # Add placeholder summary to indicate it wasn't generated
            supabase.table('links').update({
                'ai_summary': 'AI summarization not available. Please check OpenAI API key configuration.'
            }).eq('id', link_id).execute()

    except Exception as e:
        print(f"An error occurred during summarization for link_id {link_id}: {e}")
        _update_link_status(link_id, 'failed')
        return

    # 5. Finalize
    _update_link_status(link_id, 'processed')
    print(f"Successfully processed job for link_id: {link_id}")


def _generate_summary(content: str) -> str:
    """
    Generates a 2-3 sentence summary of the text content using an LLM.
    """
    if not OPENAI_API_KEY or not openai_client:
        print("OpenAI client not available - returning placeholder message")
        return "AI summary unavailable: API key not configured."
        
    # Truncate content and check if it's meaningful enough to summarize
    # Many sites (like Twitch) may not have much readable text.
    truncated_content = content.strip()[:4000] if content else ""
    
    # Check if content is empty or too short
    if not truncated_content or len(truncated_content) < 100:
        print(f"Content for summary is too short ({len(truncated_content)} chars). Skipping.")
        return "Not enough content to generate a summary."

    try:
        print(f"Generating summary for content (first 100 chars): '{truncated_content[:100]}...'")
        
        # New SDK (v1.x+)
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes web content into 2-3 concise sentences."},
                {"role": "user", "content": f"Please summarize the following content:\n\n{truncated_content}"}
            ]
        )
        summary = response.choices[0].message.content
        
        print(f"Successfully generated summary: '{summary}'")
        return summary

    except Exception as e:
        error_message = str(e)
        print(f"Error generating summary with OpenAI: {error_message}")
        if "authentication" in error_message.lower():
             return "Failed to generate summary: OpenAI authentication error. Please check your API key."
        return f"Failed to generate AI summary: {error_message[:100]}"

def _parse_html(url: str, html: str) -> Dict[str, Any]:
    """Parses the raw HTML and extracts all required data points."""
    doc = Document(html)
    soup = BeautifulSoup(html, 'lxml')
    
    main_content_html = doc.summary()
    main_content_text = BeautifulSoup(main_content_html, 'lxml').get_text(separator=' ', strip=True)

    structured_data = {
        "jsonLd": [json.loads(s.string) for s in soup.find_all('script', type='application/ld+json') if s.string],
        "openGraph": {meta['property']: meta['content'] for meta in soup.find_all('meta', property=lambda p: p and p.startswith('og:'))},
        "twitterCard": {meta['name']: meta['content'] for meta in soup.find_all('meta', attrs={'name': lambda n: n and n.startswith('twitter:')})}
    }

    return {
        "url": url,
        "title": doc.title(),
        "description": _get_meta_property(soup, 'description'),
        "author": _get_meta_property(soup, 'author'),
        "publicationDate": _get_meta_property(soup, 'article:published_time'),
        "siteName": structured_data['openGraph'].get('og:site_name'),
        "language": soup.find('html').get('lang'),
        "image_url": structured_data['openGraph'].get('og:image') or structured_data['twitterCard'].get('twitter:image'),
        "favicon_url": _get_favicon(soup, url),
        "keywords": _get_meta_property(soup, 'keywords', _split=True),
        "mainContent": {"text": main_content_text, "html": main_content_html},
        "structuredData": structured_data,
        "rawHtml": html
    }

def _update_database_with_scraped_data(link_id: str, data: Dict[str, Any]):
    """Updates the links and link_content tables with the new data."""
    links_update = {
        "title": data['title'],
        "description": data['description'],
        "author": data['author'],
        "site_name": data['siteName'],
        "lang": data['language'],
        "favicon_url": data['favicon_url'],
        "image_url": data['image_url'],
        "updated_at": "now()"
    }
    supabase.table('links').update(links_update).eq('id', link_id).execute()

    content_insert = {
        "link_id": link_id,
        "main_content_text": data['mainContent']['text'],
        "main_content_html": data['mainContent']['html'],
        "structured_data_json": json.dumps(data['structuredData']),
        "raw_html": data['rawHtml'],
    }
    supabase.table('link_content').upsert(content_insert).execute()

def _chunk_and_embed_content(link_id: str, text: str):
    """Placeholder for chunking and embedding logic."""
    print(f"Placeholder: Chunking and embedding content for link_id: {link_id}")
    # 1. Chunk the `text` into smaller, meaningful pieces.
    # 2. For each chunk, call OpenAI's embedding API.
    # 3. Batch insert the chunks, their indexes, and their embeddings into the `link_embeddings` table.
    pass

def _update_link_status(link_id: str, status: str):
    """Updates the status of a link in the database."""
    try:
        supabase.table('links').update({'status': status, 'updated_at': 'now()'}).eq('id', link_id).execute()
    except Exception as e:
        print(f"Warning: Failed to update status for link_id {link_id}: {e}")


def _get_meta_property(soup: BeautifulSoup, property_name: str, _split: bool = False) -> Optional[str] or Optional[list]:
    """Helper to get content from meta tags."""
    for prop in [property_name, f"og:{property_name}", f"twitter:{property_name}"]:
        meta = soup.find('meta', property=prop) or soup.find('meta', attrs={'name': prop})
        if meta and meta.get('content'):
            content = meta.get('content').strip()
            return content.split(',') if _split else content
    return [] if _split else None

def _get_favicon(soup: BeautifulSoup, base_url: str) -> Optional[str]:
    """Find the favicon URL."""
    for rel in ['icon', 'shortcut icon', 'apple-touch-icon']:
        link = soup.find('link', rel=rel)
        if link and link.get('href'):
            return urljoin(base_url, link.get('href'))
    # Default fallback
    parsed_uri = urlparse(base_url)
    return f"{parsed_uri.scheme}://{parsed_uri.netloc}/favicon.ico" 