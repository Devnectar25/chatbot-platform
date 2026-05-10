# Phase 7 Implementation Plan: Modular Ingestion & PostgreSQL Integration

## Goal
To transition the chatbot from a hard-coded JSON-only system to a modular, data-source-agnostic architecture. This will allow the chatbot to ingest data from PostgreSQL, MySQL, PDFs, or APIs without changing the core AI logic.

## 1. Modular Architecture Design
We will implement an **Adapter Pattern**:
- **Core Ingestor**: A single function in `rag_service.py` that takes raw text + metadata and saves it to ChromaDB.
- **Adapters**: Independent modules (e.g., `PostgresAdapter`) that handle the "dirty work" of connecting to specific sources and cleaning the data.

## 2. Proposed Changes

### [MODIFY] [rag_service.py](file:///c:/workspace/chatbot/python_service/app/services/rag_service.py)
- Refactor `ingest_dummy_data` into a generic `ingest_raw_text(app_id, data_list)` function.
- This function will be the "Universal Port" for all future adapters.

### [NEW] [postgres_adapter.py](file:///c:/workspace/chatbot/python_service/app/services/adapters/postgres_adapter.py)
- Create a new service that uses `psycopg2` to connect to PostgreSQL.
- It will fetch rows from a user-defined table, format them into descriptive strings, and send them to the Core Ingestor.

### [MODIFY] [routes.py](file:///c:/workspace/chatbot/python_service/app/api/routes.py)
- Add a new POST endpoint `/ingest/postgres` which takes an `app_id` and database connection parameters.

## 3. Multi-Tenancy Strategy
- Each client will have their own `app_id`.
- The `app_id` will be used as a filter in ChromaDB (`where={"app_id": app_id}`).
- Database credentials for each client will be stored securely in environment variables or a configuration table.

## 4. Execution Steps
1. **Infrastructure**: Create the `app/services/adapters/` directory.
2. **Core Refactor**: Update `rag_service.py` to support generic ingestion.
3. **Database Driver**: Install `psycopg2-binary`.
4. **Adapter Creation**: Build the first `PostgresAdapter`.
5. **Testing**: Sync a local/remote PostgreSQL table and verify the AI can answer questions from it.

## 5. Verification Plan
- **Integration Test**: Run `/ingest/postgres` for a test DB and check ChromaDB for new records.
- **Accuracy Test**: Ask the chatbot a question that only exists in the PostgreSQL database and ensure it answers correctly.
