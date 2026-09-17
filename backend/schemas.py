from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class GrievanceCreate(BaseModel):
    name: str
    category: str
    description: str

class FeedbackCreate(BaseModel):
    name: str
    rating: int
    comments: str

class ChatMessage(BaseModel):
    message: str
