# 🚀 Chatbot Platform: End-to-End Vercel Deployment Blueprint

This document provides a step-by-step, phase-wise guide to migrating and deploying your complete chatbot platform (React Frontend, Node.js API Gateway, and Python AI Chatbot) to **Vercel** with **$0/month** hosting costs.

---

## 📅 Phase 1: Micro-Repository Git Setup
To keep your codebase clean, maintainable, and easily integrated with Vercel, split your codebase into **3 separate Git repositories** using a common prefix:

1. **`homeveda-chatbot-frontend`** (For the React application)
2. **`homeveda-chatbot-node`** (For the Express Node.js API Gateway)
3. **`homeveda-chatbot-python`** (For the FastAPI Python AI Service)

---

## 🛠️ Phase 2: Refactoring Python code for Vercel Serverless

Vercel compiles Python scripts inside an `api/` directory into AWS Lambda serverless functions.

### Step 2.1: Add Vercel Routing Configuration
Create a `vercel.json` file in the root of your `homeveda-chatbot-python` repository:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index.py"
    }
  ]
}
```

### Step 2.2: Create the Vercel Entrypoint
Create an `api/` folder at the root, and inside it, create `index.py` with the following content:
```python
import sys
import os

# Add the parent root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the FastAPI application instance
from app.main import app
```

### Step 2.3: Switch Website Chatbot from Ollama to Gemini
Because serverless functions have a 10-second request timeout limit and cannot host a local Ollama process, migrate the web chatbot logic in `app/services/rag_service.py` to use Gemini:

1. Import `google.generativeai` in `rag_service.py`.
2. Swap out `ollama.generate` for the Gemini call:
   ```python
   # Replace local Ollama stream:
   # stream = ollama.generate(model='qwen2:1.5b', prompt=prompt, stream=True)
   
   # Use Gemini stream:
   model = genai.GenerativeModel("gemini-1.5-flash")
   response = model.generate_content(prompt, stream=True)
   
   for chunk in response:
       yield chunk.text
   ```

### Step 2.4: Optimize Lifespan Event Handlers
In `app/main.py`, remove the `warmup_models()` lifespan function call, as serverless environments boot dynamically on demand:
```python
# Before
@asynccontextmanager
async def lifespan(app: FastAPI):
    warmup_models()
    yield

# After
app = FastAPI(title="Multi-Tenant Chatbot API")
```

---

## 📦 Phase 3: Bundle ChromaDB as Read-Only Vector Store

Since Vercel has a read-only filesystem at runtime:

1. Ingest your wellness database locally on your PC so that the `python_service/chroma_db` folder contains all vector data.
2. In `python_service/.gitignore`, make sure you do **NOT** ignore the `chroma_db` directory:
   ```diff
   - chroma_db/
   ```
3. Commit and push the `chroma_db` folder to GitHub. Vercel will bundle the database SQLite files directly into the serverless environment so the API can perform queries.

---

## 🚀 Phase 4: Deploying on Vercel Dashboard

Import your 3 repositories on the Vercel Dashboard one by one:

### 1. Python AI Service (`homeveda-chatbot-python`)
* **Framework Preset:** `Other` (Vercel automatically handles FastAPI via `vercel.json`).
* **Environment Variables:**
  * `GEMINI_API_KEY`: *(Your Google AI Studio API Key)*
  * `WHATSAPP_VERIFY_TOKEN`: `homeveda_secret`

### 2. Node.js API Gateway (`homeveda-chatbot-node`)
* **Framework Preset:** `Other` (Vercel will detect `vercel.json` and compile the routes).
* **Environment Variables:**
  * `PYTHON_SERVICE_URL`: *(Your newly generated Python Vercel URL)*
  * `SUPABASE_URL`: *(Your Supabase Project URL)*
  * `SUPABASE_KEY`: *(Your Supabase Service Key)*
  * `WHATSAPP_PHONE_NUMBER_ID`: `105658605786191`
  * `WHATSAPP_ACCESS_TOKEN`: *(Your WhatsApp Permanent Token)*

### 3. React Frontend (`homeveda-chatbot-frontend`)
* **Framework Preset:** `Vite` (Vercel automatically configures the building process).
* **Environment Variables:**
  * `VITE_API_URL`: *(Your newly generated Node.js Vercel URL)*

---

## 🔗 Phase 5: Re-link Webhooks on Meta Portal

Once all services are online:
1. Go to your **Meta Developer Console** ➔ **WhatsApp** ➔ **Configuration**.
2. Click **Edit Webhook** and set the Callback URL:
   ```text
   https://[YOUR_PYTHON_VERCEL_APP_URL]/webhook/whatsapp
   ```
3. Enter the verification token: `homeveda_secret`.
4. Click **Verify and Save** to establish the connection forever!
