import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from google import genai
from database import SessionLocal, engine
from models import Base, User, Grievance, Feedback
from schemas import UserCreate, UserLogin, GrievanceCreate, FeedbackCreate, ChatMessage

# Load environment variables
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

import json
import numpy as np

with open("embeddings.json", "r") as f:
    knowledge_base = json.load(f)

def find_relevant_chunks(question, top_n=3):
    question_embedding = client.models.embed_content(
        model="gemini-embedding-001", contents=question
    ).embeddings[0].values
    
    scores = []
    for item in knowledge_base:
        similarity = np.dot(question_embedding, item["embedding"])
        scores.append((similarity, item["text"]))
    
    scores.sort(reverse=True, key=lambda x: x[0])
    return [text for _, text in scores[:top_n]]

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI backend!"}

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    new_user = User(name=user.name, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user_id": new_user.id}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {
        "message": "Login successful", 
        "user_id": db_user.id, 
        "is_admin": db_user.is_admin
    }

@app.post("/grievance")
def create_grievance(grievance: GrievanceCreate, db: Session = Depends(get_db)):
    new_grievance = Grievance(
        name=grievance.name,
        category=grievance.category,
        description=grievance.description,
    )
    db.add(new_grievance)
    db.commit()
    db.refresh(new_grievance)

    return {
        "message": "Grievance submitted successfully",
        "grievance_id": new_grievance.id,
        "status": new_grievance.status,
    }

@app.post("/feedback")
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    new_feedback = Feedback(
        name=feedback.name,
        rating=feedback.rating,
        comments=feedback.comments,
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return {
        "message": "Feedback submitted successfully",
        "feedback_id": new_feedback.id,
    }

@app.get("/grievances")
def get_grievances(db: Session = Depends(get_db)):
    grievances = db.query(Grievance).all()
    return grievances

@app.get("/feedback")
def get_all_feedback(db: Session = Depends(get_db)):
    feedback_list = db.query(Feedback).all()
    return feedback_list

SYSTEM_PROMPT = """You are an official AI assistant for MPOnline, a government e-Governance services portal in Madhya Pradesh, India.
Your job is to help citizens with questions about MPOnline services, forms, exams, fees, and procedures.

Rules you must follow:
- Only answer questions related to MPOnline services and government procedures.
- If asked something unrelated (like general trivia, coding, jokes, or personal opinions), politely say you can only help with MPOnline-related questions.
- Be clear, polite, and concise.
- If you don't know the answer, say so honestly instead of guessing.
- Never make up fake rules, fees, or procedures.
"""

@app.post("/chat")
def chat(chat_message: ChatMessage):
    relevant_chunks = find_relevant_chunks(chat_message.message)
    context = "\n\n".join(relevant_chunks)
    
    full_prompt = SYSTEM_PROMPT + "\n\nRelevant MPOnline information:\n" + context + "\n\nUser question: " + chat_message.message
    
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=full_prompt
    )
    return {"reply": response.text}