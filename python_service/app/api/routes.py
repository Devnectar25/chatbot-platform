from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.rag_service import ingest_dummy_data, generate_chat_response
from app.services.adapters.postgres_adapter import sync_postgres_to_ai

router = APIRouter()

class ChatRequest(BaseModel):
    app_id: str
    question: str
    language: str = "en-IN"

class IngestRequest(BaseModel):
    app_id: str

class IngestPostgresRequest(BaseModel):
    app_id: str
    table_name: str
    text_columns: list[str]
    metadata_columns: list[str] = []

@router.post("/ingest")
def ingest_data(request: IngestRequest):
    result = ingest_dummy_data(request.app_id)
    return result

@router.post("/chat")
def chat(request: ChatRequest):
    return StreamingResponse(
        generate_chat_response(request.app_id, request.question, request.language),
        media_type="text/plain"
    )

@router.post("/ingest/postgres")
def ingest_postgres(request: IngestPostgresRequest):
    result = sync_postgres_to_ai(
        request.app_id, 
        request.table_name, 
        request.text_columns, 
        request.metadata_columns
    )
    return result
