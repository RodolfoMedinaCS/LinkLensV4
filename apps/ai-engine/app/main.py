from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel, HttpUrl
import logging
import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from readability import Document
import openai

# --- Environment Variable Loading ---
# Determine the path to the .env.local file in the 'web' app directory
# The script runs from `apps/ai-engine`, so we go up one level and then into `web`
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'apps', 'web', '.env.local')
load_dotenv(dotenv_path=dotenv_path)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- OpenAI Configuration ---
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    logger.warning("OPENAI_API_KEY is not set. AI summary generation will be skipped.")
    openai_client = None
else:
    openai.api_key = OPENAI_API_KEY
    openai_client = openai

# --- Supabase Configuration ---
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Supabase credentials are not set in the environment.")

app = FastAPI(title="LinkLens AI Engine")

class ScrapeRequest(BaseModel):
    url: HttpUrl
    link_id: str

# The Pydantic model for the new, focused request
class ProcessRequest(BaseModel):
    link_id: str
    page_content: str

SUMMARIZATION_PROMPT_TEMPLATE = """
Act as an expert research assistant and technical writer specializing in content distillation.

Your task is to generate a concise, neutral, and informative summary of the provided web page content.

**Context:**
The summary is for a user of 'LinkLens,' an intelligent bookmarking platform for knowledge workers, researchers, and developers. The user needs to quickly understand the core topic and key takeaways to triage content and decide if it's relevant for their work. This summary is a key part of the "Smart Summaries" feature, which is a core differentiator for the product.

**Input Content:**

{page_content}

**Output Rules:**

**DO:**
- **Format:** Write a single, dense paragraph.
- **Length:** The summary must be between 2 and 3 sentences long.
- **Content:** Identify and synthesize the main argument, key findings, or central purpose of the content.
- **Tone:** Maintain a neutral, objective, and encyclopedic tone.
- **Style:** Paraphrase and synthesize the information.

**DON'T:**
- **Phrasing:** Do not use introductory phrases like "This article discusses..." or "The author argues...".
- **Verbatim Copying:** Do not copy sentences directly from the source text.
- **Opinion:** Do not include personal opinions or subjective statements.
"""

# A new prompt for handling low-content pages
LIST_RECOGNIZER_PROMPT = """
You are a content classification assistant. Your task is to look at a short piece of text from a web page and write a single, brief sentence describing what it appears to be. The tone should be neutral and descriptive.

Rules:
- If the text is a list of tools, libraries, or products, describe it as such. Example: "A list of design and animation libraries, including ShadCN and Framer Motion."
- If the text appears to be just a heading or title, state what the topic is. Example: "A page about modern web design techniques."
- If the text is nonsensical or just a few random words, respond with only "N/A".
- The output must be a single sentence.

Text to analyze:

{page_content}
"""

def get_ai_summary(text_content: str) -> str:
    """
    Generates a description using a multi-layered approach.
    This function is now a pure text processor and has no knowledge of titles.
    """
    MIN_CONTENT_LENGTH = 250
    if not openai_client:
        logger.warning("OpenAI client not available. Skipping summary.")
        return "" # The final fallback is handled by the caller

    # Layer 1: Content is long enough for a full, robust summary
    if len(text_content) >= MIN_CONTENT_LENGTH:
        logger.info("Content is sufficient for full summarization.")
        prompt = SUMMARIZATION_PROMPT_TEMPLATE.format(page_content=text_content[:12000])
        try:
            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=150
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Full summarization failed: {e}. Returning empty.")
            return ""

    # Layer 2: Content is short; try the "List Recognizer" prompt
    else:
        logger.info("Content is short. Attempting list recognition.")
        prompt = LIST_RECOGNIZER_PROMPT.format(page_content=text_content)
        try:
            response = openai_client.chat.completions.create(
                # Use a cheaper/faster model for this simple task
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=50
            )
            recognized_text = response.choices[0].message.content.strip()
            if "N/A" in recognized_text or not recognized_text:
                logger.info("Recognition returned N/A. Returning empty.")
                return ""
            return recognized_text
        except Exception as e:
            logger.error(f"List recognition failed: {e}. Returning empty.")
            return ""

def process_content(request: ProcessRequest):
    """
    Processes text, generates a summary, and calls an Edge Function to update the record.
    This function is now a pure AI specialist.
    """
    logger.info(f"Processing content for link_id: {request.link_id}")

    try:
        # --- 1. Generate AI Summary ---
        # It no longer needs a fallback title, as the original title is already correct.
        ai_summary = get_ai_summary(request.page_content)

        # --- 2. Call Supabase Edge Function with a lean payload ---
        # The payload only contains the data this engine is responsible for.
        update_payload = {
            'status': 'processed',
            'ai_summary': ai_summary,
        }

        # If the summary is empty, we don't need to include it in the update.
        if not ai_summary:
            del update_payload['ai_summary']
        
        function_url = f"{SUPABASE_URL}/functions/v1/update-link"
        headers = {
            'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
            'Content-Type': 'application/json'
        }
        body = {
            'link_id': request.link_id,
            'payload': update_payload
        }

        logger.info(f"Invoking Supabase Edge Function for link_id {request.link_id} with payload: {update_payload}")
        
        response = requests.post(function_url, headers=headers, json=body)
        response.raise_for_status() # Will raise an exception for 4xx/5xx responses

        logger.info(f"Edge Function response for link_id {request.link_id}: {response.json()}")
        logger.info(f"Successfully processed and updated link_id: {request.link_id}")

    except Exception as e:
        logger.error(f"Error processing content for link_id: {request.link_id}. Error: {e}")
        # We can no longer update the status here directly, but the error is logged.

@app.get("/")
def read_root():
    return {"status": "AI engine is running"}

@app.post("/process")
async def process_endpoint(request: ProcessRequest, background_tasks: BackgroundTasks):
    """
    This endpoint receives page content to be processed.
    It immediately returns a confirmation and processes the content
    in the background to avoid tying up the client.
    """
    logger.info(f"Accepted content processing task for link_id: {request.link_id}")
    background_tasks.add_task(process_content, request)
    return {"message": "Content processing task accepted and is being processed in the background."} 