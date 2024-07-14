from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str

class TranscriptData(BaseModel):
    transcript: str
