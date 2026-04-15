import os
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from simple_agent import SimpleAIAgent as AIAgent
from crawler import WebsiteCrawler
from vector_db import VectorDBManager
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv(override=True)

app = FastAPI(title="AI Chatbot Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://benevolent-bavarois-0cadab.netlify.app",
        "*"  # Fallback for development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/")
async def root():
    return {"message": "AI Chatbot Backend is running", "status": "ok"}

agent = AIAgent()
db_manager = VectorDBManager()

class ChatRequest(BaseModel):
    query: str
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response_text = agent.chat(request.query, chat_history=request.history)
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def background_reindex(base_url: str):
    print(f"Starting reindex for {base_url}")
    crawler = WebsiteCrawler(base_url)
    crawler.crawl()
    content = crawler.get_all_content()
    
    # Also add local PDF if exists
    pdf_path = "/home/mitesh/Documents/manufacturing_website/Encore_Shell_Cast_Pump_Catalogue.pdf"
    if os.path.exists(pdf_path):
        print(f"Adding local PDF: {pdf_path}")
        with open(pdf_path, 'rb') as f:
            crawler.crawl_pdf(pdf_path, f.read())
            content = crawler.get_all_content()

    db_manager.clear_db()
    db_manager.add_content(content)
    print("Reindexing complete.")

@app.post("/reindex")
async def reindex(background_tasks: BackgroundTasks):
    base_url = os.getenv("BASE_URL", "https://encoreshellcastllp.com/")
    background_tasks.add_task(background_reindex, base_url)
    return {"message": "Reindexing started in background"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
