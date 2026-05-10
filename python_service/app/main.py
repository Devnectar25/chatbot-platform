from fastapi import FastAPI
from app.api.routes import router
from app.services.rag_service import warmup_models
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs on startup
    warmup_models()
    yield

app = FastAPI(title="Multi-Tenant Chatbot API", lifespan=lifespan)

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Chatbot AI Service is running!"}
