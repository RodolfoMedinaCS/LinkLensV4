import requests
from bs4 import BeautifulSoup
from readability import Document
from typing import Optional, Dict, Any
import json
from urllib.parse import urljoin, urlparse
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# --- Supabase Initialization ---
# Load environment variables from .env file in the current directory
load_dotenv()

# Use environment variables for secure credential management
SUPABASE_URL = os.environ.get("SUPABASE_URL")
# IMPORTANT: This must be the SERVICE_ROLE_KEY, not the anon key
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Supabase credentials (URL and Service Role Key) not found in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
# --- End Supabase Initialization ---

def scrape_and_update_link(link_id: str, url: str):
    """
    Scrapes a URL, processes the data, and updates the Supabase database.
    """
    print(f"Starting scrape for link_id: {link_id}, url: {url}")
    
    headers = {'User-Agent': 'LinkLensBot/1.0 (+https://linklens.io/about)'}
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        _update_link_status(link_id, 'scraping')

        # Step 1: Scrape the data from the URL
        scraped_data = _parse_html(url, response.text)

        # Step 2: Update the 'links' and 'link_content' tables
        _update_database_with_scraped_data(link_id, scraped_data)

        # Step 3: Chunk text and generate embeddings (Placeholder)
        _chunk_and_embed_content(link_id, scraped_data['mainContent']['text'])

        # Final step: Mark the link as 'processed'
        _update_link_status(link_id, 'processed')
        
        print(f"Successfully processed and stored link_id: {link_id}")

    except requests.RequestException as e:
        print(f"Error fetching {url} for link_id {link_id}: {e}")
        _update_link_status(link_id, 'failed')
    except Exception as e:
        print(f"An unexpected error occurred for link_id {link_id}: {e}")
        _update_link_status(link_id, 'failed')


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