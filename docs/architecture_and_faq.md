# Chatbot Development & Architecture FAQ

This document serves as a reference for the repository structure, dependency management, and multi-tenant scaling strategy for the Chatbot project.

---

## 1. Repository Management (Monorepo Strategy)

We use a **Monorepo** approach for this project. All services are housed within a single repository named `chatbot`.

### Directory Structure:
- `/node_service`: API Gateway (TypeScript/Express). Handles routing, security, and multi-tenant mapping.
- `/python_service`: AI Core (Python/FastAPI). Manages the RAG pipeline, Vector DB (ChromaDB), and LLM integration.
- `/react_frontend`: The Chat Widget (React/Vite). Compiled into a single embeddable JS file.
- `/docs`: Implementation plans and architectural documentation.

**Benefit:** Tightly coupled changes across the frontend and backend can be managed in a single commit, ensuring API consistency.

---

## 2. Environment Setup & Dependencies

To run this project locally, a developer needs the following installed on their machine:

### Core Requirements:
1. **Node.js (v18+)**: For the Gateway and Frontend build tools.
2. **Python (v3.10+)**: For the AI logic and Vector processing.
3. **Ollama**: The local LLM engine.
   - Must have the model downloaded: `ollama run qwen2:1.5b` (or preferred model).
4. **C++ Build Tools**: Required for `chromadb` to compile on Windows.

### Installation Steps:
1. **Frontend:** `cd react_frontend && npm install`
2. **Node Gateway:** `cd node_service && npm install`
3. **Python AI:** `cd python_service && pip install -r requirements.txt`

---

## 3. Data Syncing & Local Development

### Vector Database Persistence:
- The AI memory is stored in a local folder named `chroma_db` inside the `python_service`.
- **Sync Requirement:** Since database files are generally excluded from Git (via `.gitignore`), a developer cloning the repo for the first time will have an "empty" AI.
- **Action:** They must run the ingestion endpoint (`/ingest`) once to populate their local Vector DB with the training data.

### Production Behavior:
In a hosted production environment, the database remains persistent on the server. End-users and developers connecting to the production API do **not** need to sync data.

---

## 4. Multi-Tenant Scaling Strategy

The application is designed to support multiple clients (tenants) using a single codebase.

### Different Data Sources:
We utilize the **Adapter Pattern**. 
- To support a new database (e.g., MySQL), we create a specific adapter (e.g., `mysql_adapter.py`).
- This adapter pulls data from the client's source and pushes it into our central Vector DB, tagged with a unique `app_id`.

### Multi-Tenant Isolation:
- Every document in the Vector DB is tagged with an `app_id` (e.g., `homeveda`, `client_b`).
- When a user chats, the system filters the search results: `where={"app_id": "homeveda"}`.
- This ensures data from one client never leaks into another's conversation.

### Design Customization:
- **Config-Driven UI:** The chatbot widget reads configuration from the `<script>` tag's data attributes:
  - `data-app-id`: Identifies the client/data source.
  - `data-primary-color`: Overrides the widget theme.
  - `data-bot-name`: Changes the assistant's display name.
- The React application uses these attributes to dynamically style the UI at runtime.
