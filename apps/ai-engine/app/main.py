from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Header
from pydantic import BaseModel
import logging
import os
from dotenv import load_dotenv
import openai
from supabase import create_client, Client
import uuid
from typing import Annotated

# --- Environment Variable Loading & Service Configurations ---
# Determine the path to the .env.local file in the 'web' app directory
# The script runs from `apps/ai-engine`, so we go up one level and then into `web`
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'apps', 'web', '.env.local')
load_dotenv(dotenv_path=dotenv_path)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- OpenAI Configuration ---
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
openai_client = None
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY
    openai_client = openai
else:
    logger.warning("OPENAI_API_KEY is not set.")

# --- Supabase Configuration ---
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Supabase credentials are not set in the environment.")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Add Internal API Key for security
INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY")
if not INTERNAL_API_KEY:
    raise RuntimeError("INTERNAL_API_KEY is not set in the environment.")

app = FastAPI(title="LinkLens AI Engine")

# --- Security Dependency ---
async def verify_api_key(authorization: Annotated[str | None, Header()] = None):
    """Dependency to verify the internal API key."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is missing.")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer" or token != INTERNAL_API_KEY:
            raise HTTPException(status_code=403, detail="Invalid API Key.")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format.")

# --- Pydantic Models ---
class AIProcessingRequest(BaseModel):
    link_id: uuid.UUID
    page_content: str

# --- AI Prompt Template ---
SUMMARIZATION_PROMPT_TEMPLATE = """
Act as an expert research assistant and technical writer specializing in content distillation.
Your task is to generate a concise, neutral, and informative summary of the provided web page content.
**Input Content:**
{page_content}
**Output Rules:**
- **Format:** Write a single, dense paragraph.
- **Length:** The summary must be between 2 and 3 sentences long.
- **Tone:** Maintain a neutral, objective, and encyclopedic tone.
- **Style:** Paraphrase and synthesize the information.
- **DON'T:** Do not use introductory phrases like "This article discusses...". Do not copy sentences directly.
"""

# --- Core AI and Database Logic ---
def process_and_update_link(request: AIProcessingRequest):
    """
    The core background task. It generates an AI summary and updates the
    link record in Supabase.
    """
    logger.info(f"Starting AI processing for link_id: {request.link_id}")
    ai_summary = ""
    status = "failed" # Default status to 'failed'. It will be updated on success.

    if openai_client and request.page_content:
        try:
            logger.info(f"Generating summary for content (first 100 chars): {request.page_content[:100]}")
            prompt = SUMMARIZATION_PROMPT_TEMPLATE.format(page_content=request.page_content[:12000])
            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=150
            )
            ai_summary = response.choices[0].message.content.strip()
            status = "processed"
            logger.info(f"Successfully generated AI summary for link_id: {request.link_id}")
        except Exception as e:
            logger.error(f"AI summary generation failed for link_id {request.link_id}: {e}")
            # The status will remain 'failed'
    else:
        logger.warning(f"Skipping AI summary for link_id {request.link_id} due to missing content or client.")
        # If there's no content, we just mark it as completed, not failed.
        status = "completed"

    update_payload = {
        "ai_summary": ai_summary,
        "status": status,
    }

    try:
        logger.info(f"Updating link {request.link_id} with payload: {update_payload}")
        update_result = supabase.table("links").update(update_payload).eq("id", str(request.link_id)).execute()
        
        # The V1 supabase-py client response object has a 'data' attribute on success.
        # Check if there's data and if the error attribute is not set.
        if update_result.data:
             logger.info(f"Successfully updated link_id: {request.link_id} in database. Response: {update_result.data}")
        else:
             logger.error(f"Supabase update for link_id {request.link_id} did not return data, potential failure.")

    except Exception as e:
        logger.error(f"CRITICAL: Failed to update link {request.link_id} in Supabase: {e}")

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"status": "AI engine is running"}

@app.post("/api/v1/process")
async def process_link_content(
    request: AIProcessingRequest,
    background_tasks: BackgroundTasks,
    # Add the security dependency to this endpoint
    api_key: None = Depends(verify_api_key)
):
    """
    This endpoint receives a link_id and its pre-scraped content.
    It acknowledges the request immediately and processes the AI summary
    in the background. It is protected by an internal API key.
    """
    logger.info(f"Accepted AI processing task for link_id: {request.link_id}")
    background_tasks.add_task(process_and_update_link, request)
    return {"message": "AI processing task accepted and initiated."} 