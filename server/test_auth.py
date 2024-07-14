import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models import User
from app.database import user_collection
from app.routers.auth import create_access_token

@pytest.fixture
def client():
    return TestClient(app)

def test_create_access_token():
    test_user = {"username": "testuser"}
    token = create_access_token(test_user)
    assert isinstance(token, str)

def test_login(client):
    # Assuming you have a /token endpoint for login
    # make sure you create a testuser in database
    response = client.post("/token", data={"username": "vasu", "password": "string"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_credentials(client):
    response = client.post("/token", data={"username": "nonexistentuser", "password": "invalidpassword"})
    assert response.status_code == 401
    assert "detail" in response.json() and "Incorrect username or password" in response.json()["detail"]
