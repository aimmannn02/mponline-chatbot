# MPOnline Chatbot

An AI-powered FAQ chatbot that answers citizens' questions about MPOnline services using **Retrieval-Augmented Generation (RAG)**. Answers come from a domain-specific service rulebook instead of the model's guesses, and anything the bot can't answer can be escalated to a human expert.

Built during my Software Engineering & Development internship at **MPOnline Limited** (Govt. of MP & TCS Joint Venture).

## Features

- **RAG-based answers**: questions are matched against a searchable knowledge base built from the MPOnline service rulebook, and the LLM answers from the retrieved passages.
- **Document OCR**: text can be extracted from documents and added to the knowledge base.
- **Chat interface**: a React chat UI for asking questions in natural language.
- **"Ask an Expert" escalation**: questions the bot can't resolve can be passed to a human expert.
- **Grievance registration**: users can file a grievance directly from the app.
- **Feedback submission**: users can rate and comment on their experience.
- **Analytics dashboard**: an overview of usage and activity.
- **User accounts**: sign-up and login with hashed passwords.

## How it works

1. **Ingest**: the rulebook and scraped service pages are split into chunks and converted into embeddings, which are stored for semantic search.
2. **Retrieve**: when a user asks a question, the most relevant chunks are found by semantic similarity.
3. **Generate**: the retrieved text is sent to the LLM (Gemini API) with the question, so the answer stays grounded in the rulebook.
4. **Escalate**: if the answer isn't good enough, the user can use "Ask an Expert".

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Backend | Python, REST APIs (FastAPI) |
| AI / NLP | RAG, semantic search, embeddings, OCR, prompt engineering |
| LLM APIs | Google Gemini, OpenAI |
| Data | SQLite, JSON embeddings |
| Ingestion | Firecrawl (website scraping) |

## Project structure

```
mponline-chatbot/
├── backend/     # API, database models, ingestion scripts
├── frontend/    # React chat UI, dashboard, grievance and feedback pages
└── README.md
```

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/aimmannn02/mponline-chatbot.git
cd mponline-chatbot
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` (never commit this file):

```
GEMINI_API_KEY=your_gemini_key
FIRECRAWL_API_KEY=your_firecrawl_key
```

Build the knowledge base, then start the server:

```bash
python ingest.py
uvicorn main:app --reload
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local URL that Vite prints in the terminal.

## Screenshots

### 🔑 Authentication
User registration and secure authentication portal interface.
<img width="2940" height="1662" alt="Image 16-10-26 at 9 48 AM" src="https://github.com/user-attachments/assets/47f43382-1ea0-4093-8ec1-0802b057f8c6" />
*Figure 1: User Account Registration Screen*

### 🤖 AI-Powered FAQ Assistant
Interactive chatbot retrieving service rules and document requirements in real time.
<img width="2940" height="1669" alt="Image 16-10-26 at 9 54 AM" src="https://github.com/user-attachments/assets/461173e0-5c7d-4e36-a163-48524e7e393b" />
<img width="2940" height="1668" alt="Image 16-10-26 at 9 53 AM" src="https://github.com/user-attachments/assets/4f2d0343-5636-4eb5-ac2f-f3c369895d22" />
*Figure 2: AI Chatbot answering document requirements for government services*

### 📋 Grievance Management
User portal to register new grievances and track submission status.

<img width="2940" height="1667" alt="Image 16-10-26 at 9 55 AM" src="https://github.com/user-attachments/assets/fe2b5fbb-d405-4567-b065-e78b388c06b0" />
*Figure 3: Grievance submission form and real-time status tracking*

### ⭐ Feedback Module
Feedback submission interface for capturing user ratings and service evaluation.

<img width="2940" height="1662" alt="Screenshot 2026-10-16 at 9 56 21 AM" src="https://github.com/user-attachments/assets/9a4e9876-0750-459b-a296-c8bedceff06b" />
*Figure 4: User feedback submission form with rating system*

### 👤 User Profile Dashboard
User profile screen displaying account details and session control.

<img width="2940" height="1664" alt="Image 16-10-26 at 9 57 AM" src="https://github.com/user-attachments/assets/ebc87dc1-baf8-455a-9eb9-e11d1ebdc23e" />
*Figure 5: User profile dashboard displaying user ID and account credentials*

## What I learned

- Designing a RAG pipeline end to end: ingestion, embeddings, retrieval and answer generation.
- Turning real citizen-support workflows into technical requirements for AI applications.
- Connecting a React frontend to a Python REST API.
- Keeping secrets out of code with environment variables.

## Notes

- API keys are read from environment variables and are not stored in this repository.
- The knowledge base is built from MPOnline service information. Please do not reuse it outside its intended purpose.

## Author

**Aiman Ansari**: B.Tech CSE (AI & ML), VIT Bhopal, class of 2027

[LinkedIn](https://linkedin.com/in/ansari-aiman) · [Email](mailto:aimmannn02@gmail.com)
