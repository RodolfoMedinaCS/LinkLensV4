from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI(
    title="LinkLens AI Engine",
    description="API for LinkLens AI functionality including summarization, clustering, and semantic search",
    version="0.1.0"
)

class Link(BaseModel):
    url: str
    title: str = None
    description: str = None
    content: str = None

class Summary(BaseModel):
    summary: str

@app.get("/")
def read_root():
    return {
        "service": "LinkLens AI Engine",
        "status": "running",
        "version": "0.1.0"
    }

@app.post("/summarize", response_model=Summary)
async def summarize_link(link: Link):
    """
    Generates a summary for a given link
    """
    # Placeholder implementation
    return {
        "summary": f"This is a placeholder summary for '{link.title}'. In the full implementation, this would be generated by an LLM."
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 