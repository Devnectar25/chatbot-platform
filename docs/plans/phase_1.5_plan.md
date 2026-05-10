COMPREHENSIVE MULTI-TENANT CHATBOT ARCHITECTURE PLAN

1. HIGH-LEVEL ARCHITECTURE
* Goal: Build a generic "Bot as a Service" embeddable in any application (Java, React, etc.).
* Architecture Style: Multi-Tenant Architecture (each application is a "Tenant" with isolated data).
* Component Stack:
  - React (Frontend): An embeddable script/widget that can be injected into any website.
  - Node.js (API Gateway): Handles API keys, routing, and user chat history.
  - Python (AI Service): Manages the RAG pipeline (converting data to embeddings and searching).
  - Ollama (LLM Engine): Generates AI responses locally with multilingual support.
  - Vector Database: Stores the vectorized "training" data (e.g., Qdrant or Pinecone).

--------------------------------------------------

2. HOSTING STRATEGY (VERCEL + OLLAMA)
* Constraint: Vercel uses Serverless Functions (no GPUs, short lifespans), meaning Ollama cannot be hosted directly on Vercel.
* Solution (Split Hosting):
  - Vercel hosts the React Frontend and the Node.js Backend.
  - A Separate Machine (Local PC for Development, VPS for Production) hosts the Ollama AI Server.

--------------------------------------------------

3. DATA HANDLING & MULTI-TENANCY
* The Golden Rule (Tenant Isolation): Every piece of data must be tagged with a unique "app_id" to ensure data privacy between different applications.
* What is a "DB Dump": An export of an application's database (like a .json or .csv file) that the bot will use to learn.
* Proof of Concept (PoC) Strategy: We will use dummy JSON data first. Once working, we can easily swap it for real database dumps.
* 3 Ways to Sync Data:
  1. The "Push" Approach (Real-Time): External apps push real-time webhooks to our bot's API.
  2. The "Pull" Approach (Legacy): Our bot runs a cron job to connect to the external app's database and fetch updates.
  3. The "Manual" Approach (For PoC): Application admins manually upload DB dumps via an admin dashboard.

--------------------------------------------------

4. LOCAL OLLAMA SETUP
* Recommended Model: Meta's "llama3" (excellent native multilingual support).
* Installation Steps:
  1. Go to https://ollama.com/download and download the Windows version.
  2. Run the downloaded .exe installer.
  3. Open your terminal (PowerShell) and type: "ollama run llama3".
  4. Wait for the model to download (approx 4.7 GB).
  5. Once done, the Ollama API is automatically ready at: http://localhost:11434.

--------------------------------------------------

5. SYSTEM WORKFLOWS
* The "Training" Workflow:
  - Admin uploads a data file.
  - Python script extracts text and generates mathematical vector embeddings.
  - Embeddings are saved to the Vector DB tagged with the specific "app_id".
* The "Chatting" Workflow:
  - User sends a message via the React widget.
  - Node.js routes the message + "app_id" to Python.
  - Python searches the Vector DB for the specific app's context.
  - Python sends context + user question to the local Ollama API.
  - Ollama generates the final answer and sends it back to the user.

--------------------------------------------------

6. DEVELOPMENT SUPPORT
* Google Antigravity (AI Assistant) will help by:
  - Writing the React components.
  - Setting up the Node.js and Python APIs.
  - Debugging local Ollama connections.
