# FastAPI Authentication and Transcription API

This project implements a FastAPI-based RESTful API for user authentication and audio transcription using Deepgram's speech-to-text API. It includes endpoints for user registration, authentication, token generation, audio transcription, and saving transcription into the database.

## Features

- User registration (`/sign-up`) and authentication (`/token`)
- JWT token-based authentication using OAuth
- Protected routes requiring authentication
- Audio transcription (`/transcribe`) using Deepgram API
- Saving transcripts (`/save_transcript`) to MongoDB

## Installation

### Prerequisites

- Python 3.10+
- MongoDB
- Deepgram API key

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vasut02/speech-to-text.git
   cd speech-to-text/server
1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
3. **Set up environment variables:**
   ```bash
    SECRET_KEY=your_secret_key_here
    ALGORITHM=HS256
    MONGO_URI=your_mongodb_connection_uri_here
    DEEPGRAM_API_KEY=your_deepgram_api_key_here
4. **Run the FastAPI server:**
    ```bash
    uvicorn main:app --reload
5. **Access the API:**
   Navigate to http://localhost:8000/docs in your web browser to access the Swagger UI. Here you can explore and interact with the API endpoints.


### Usage

- User Registration: Use the /sign-up endpoint to register a new user.
- User Authentication: Obtain an access token by sending a POST request to /token with valid credentials (username and password).
- Protected Routes: Access protected endpoints by including the access token in the Authorization header (Bearer token).
- Transcription: Upload an audio file (WAV or MP3) to /transcribe for automatic transcription using Deepgram API.
- Saving Transcripts: Use /save_transcript to save the transcript data to MongoDB.

