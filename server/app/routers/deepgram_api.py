from fastapi import APIRouter, UploadFile, HTTPException, Depends, File
from fastapi.responses import JSONResponse
from pydub import AudioSegment
from deepgram import Deepgram
import io
from pydantic import BaseModel
from datetime import datetime
from database import transcript_collection
from routers.auth import get_current_user
from models import TranscriptData
from dotenv import dotenv_values

# Load environment variables from .env file
config = dotenv_values(".env")

# Retrieve Deepgram API key from environment variables
DEEPGRAM_API_KEY = config["DEEPGRAM_API_KEY"]

# Initialize Deepgram SDK with API key
deepgram = Deepgram(DEEPGRAM_API_KEY)

router = APIRouter()

def convert_audio_to_wav_bytes(file: UploadFile) -> bytes:
    """
    Converts an uploaded audio file (WAV or MP3) to WAV format and returns the byte representation.
    
    Args:
    - file (UploadFile): The audio file uploaded by the user.
    
    Returns:
    - bytes: Byte representation of the audio file in WAV format.
    """
    audio = AudioSegment.from_file(file.file, format=file.filename.split('.')[-1])
    wav_io = io.BytesIO()
    audio.export(wav_io, format='wav')
    wav_io.seek(0)
    return wav_io.read()

async def transcribe_audio(audio_bytes: bytes) -> str:
    """
    Transcribes audio data to text using the Deepgram speech-to-text API.
    
    Args:
    - audio_bytes (bytes): Byte representation of the audio file in WAV format.
    
    Returns:
    - str: Transcription of the audio file.
    """
    source = {'buffer': audio_bytes, 'mimetype': 'audio/wav'}
    response = await deepgram.transcription.prerecorded(
        source,
        {
            'punctuate': True,
            'language': 'en-US'
        }
    )
    return response['results']['channels'][0]['alternatives'][0]['transcript']

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """
    Endpoint to transcribe an uploaded audio file using the Deepgram speech-to-text API.
    
    Args:
    - file (UploadFile): The audio file uploaded by the user.
    - current_user (dict): The currently authenticated user extracted from JWT token.
    
    Returns:
    - JSONResponse: JSON response containing the transcript of the audio file.
    """
    if file.content_type not in ["audio/wav", "audio/mpeg"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only WAV or MP3 is allowed.")

    try:
        # Convert audio file to WAV format
        wav_bytes = convert_audio_to_wav_bytes(file)

        # Transcribe audio to text
        transcript = await transcribe_audio(wav_bytes)

        # Return JSON response with transcript
        return JSONResponse(content={"transcript": transcript})

    except Exception as e:
        # Raise HTTP exception if an error occurs
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save_transcript")
async def save_transcript(data: TranscriptData, current_user: dict = Depends(get_current_user)):
    """
    Endpoint to save a transcript data to the database.
    
    Args:
    - data (TranscriptData): Pydantic model representing the transcript data.
    - current_user (dict): The currently authenticated user extracted from JWT token.
    
    Returns:
    - JSONResponse: JSON response confirming successful saving of transcript.
    """
    try:
        # Prepare transcript data with username and timestamp
        transcript_data = data.dict()
        transcript_data['username'] = current_user['username']
        transcript_data['timestamp'] = datetime.utcnow()

        # Insert transcript data into MongoDB collection
        result = transcript_collection.insert_one(transcript_data)

        # Return JSON response with success message and inserted ID
        return JSONResponse(content={"message": "Transcript saved successfully", "id": str(result.inserted_id)})

    except Exception as e:
        # Raise HTTP exception if an error occurs
        raise HTTPException(status_code=500, detail=str(e))
