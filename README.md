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
<img width="2940" height="1912" alt="Image 16-10-26 at 9 48 AM" src="https://github.com/user-attachments/assets/d2fd1433-ad8e-4720-a8fe-9217de28364b" />

*Figure 1: User Account Registration Screen*

### 🤖 AI-Powered FAQ Assistant
Interactive chatbot retrieving service rules and document requirements in real time.
<img width="2940" height="1912" alt="Image 16-10-26 at 9 54 AM" src="https://github.com/user-attachments/assets/0ceb9fd1-d3f2-497e-be7a-7df69bf2c18b" />
<img width="2940" height="1912" alt="Image 16-10-26 at 9 53 AM" src="https://github.com/user-attachments/assets/e22550d4-4773-4f0b-9acd-44d7ababcf83" />

*Figure 2: AI Chatbot answering document requirements for government services*

### 📋 Grievance Management
User portal to register new grievances and track submission status.
<img width="1470" height="956" alt="Screenshot 2026-10-16 at 9 56 21 AM" src="https://github.com/user-attachments/assets/03104ddf-3611-4358-9a71-b1f9d70d5ad2" />
<img width="2940" height="1912" alt="Image 16-10-26 at 9 55 AM" src="https://github.com/user-attachments/assets/b6b44107-7199-489c-a06c-ac42318c5285" />


*Figure 3: Grievance submission form and real-time status tracking*

### ⭐ Feedback Module
Feedback submission interface for capturing user ratings and service evaluation.


*Figure 4: User feedback submission form with rating system*

### 👤 User Profile Dashboard
User profile screen displaying account details and session control.

<img width="2940" height="1912" alt="Image 16-10-26 at 9 57 AM" src="https://github.com/user-attachments/assets/9eb7dcf9-6af4-4cea-9104-1056713f4f76" />

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
