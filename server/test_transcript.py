import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models import TranscriptData
from app.database import transcript_collection

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def access_token(client):
    # Mock login and get access token
    test_user = {"username": "vasu", "password": "string"}
    response = client.post("/token", data=test_user)
    assert response.status_code == 200
    return response.json()["access_token"]

def test_transcribe_endpoint(client, access_token):
    # Assuming you have a /transcribe endpoint for transcription
    # Mocking a file upload for testing purposes
    files = {"file": ("test_audio.wav", open("../sample-audio.wav", "rb"), "audio/wav")}
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.post("/transcribe", files=files, headers=headers)
    assert response.status_code == 200
    assert "transcript" in response.json()

def test_save_transcript_endpoint(client):
    # Assuming you have a /save_transcript endpoint
    data = TranscriptData(transcript="Test transcript")
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.post("/save_transcript", json=data.dict(), headers=headers)
    assert response.status_code == 200
    assert "message" in response.json() and "Transcript saved successfully" in response.json()["message"]
