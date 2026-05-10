# Multi-Tenant AI Chatbot Platform

A powerful, data-agnostic "Bot as a Service" platform built with **Node.js**, **Python**, and **React**. This project allows you to embed a smart AI assistant into any website, train it on custom data (JSON, PostgreSQL, etc.), and provide multi-language voice interactions.

## 🚀 Features
- **Multi-Tenant Architecture:** Host multiple clients (tenants) with isolated data using `app_id`.
- **RAG (Retrieval-Augmented Generation):** AI answers questions based on your specific database/files.
- **Embeddable Widget:** A single `<script>` tag to add the chatbot to any website (React, Java, HTML).
- **Voice & Multilingual:** Supports Speech-to-Text (Mic) and Text-to-Speech (Speaker) in multiple languages (English, Hindi, Marathi, etc.).
- **Streaming Responses:** Real-time, character-by-character typing for a smooth user experience.
- **Data Adapters:** Easily ingest data from JSON files or PostgreSQL databases.

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Framer Motion, Lucide React.
- **API Gateway:** Node.js, TypeScript, Express.
- **AI Service:** Python, FastAPI, ChromaDB (Vector DB).
- **LLM Engine:** Ollama (Local LLM hosting).

---

## 📦 Project Structure
```text
/node_service      # API Gateway (Handles routing & security)
/python_service    # AI Engine (Handles RAG & Embeddings)
/react_frontend    # The Chat Widget UI
/docs              # Implementation plans and FAQ
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Ollama:** [Download here](https://ollama.com/)
- **Download LLM Model:**
  ```bash
  ollama run qwen2:1.5b
  ```

### 2. Python AI Service
```bash
cd python_service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Node.js Gateway
```bash
cd node_service
npm install
npm run dev
```

### 4. React Frontend (Widget)
```bash
cd react_frontend
npm install
npm run dev # To test locally
npm run build # To generate the chatbot-widget.js
```

---

## 🔌 Integration
To add the chatbot to your website, include the following script tag:

```html
<script 
  src="http://localhost:3000/chatbot-widget.js" 
  data-app-id="homeveda_shop" 
  data-primary-color="#2563eb"
></script>
```

---

## 📖 Documentation
Detailed implementation plans and architectural FAQs can be found in the `/docs` folder.
- [Architecture & FAQ](docs/architecture_and_faq.md)
- [Phase 6: Voice Integration](docs/plans/phase_6_plan.md)
- [Phase 7: PostgreSQL Adapter](docs/plans/phase_7_plan.md)

---

## 🛡️ License
MIT
