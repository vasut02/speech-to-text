from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import jwt
from jwt import PyJWTError
from passlib.context import CryptContext
from models import User # Importing the User model
from database import user_collection # Importing the MongoDB collection
from dotenv import dotenv_values

# Load environment variables from .env file
config = dotenv_values(".env")

# Retrieve SECRET_KEY and ALGORITHM from environment variables
SECRET_KEY = config["SECRET_KEY"]
ALGORITHM = config["ALGORITHM"]

# Initialize CryptContext for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Function to create an access token with optional expiration time.
    
    Args:
    - data (dict): Data to encode into the token payload.
    - expires_delta (Optional[timedelta]): Optional expiration time delta for the token.
    
    Returns:
    - str: Encoded JWT access token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta # Calculate token expiration time
    else:
        expire = datetime.now() + timedelta(minutes=15) # Default expiration time is 15 minutes
    to_encode.update({"exp": expire}) 
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) # Encode token using JWT library
    return encoded_jwt

def decode_token(token: str):
    """
    Function to decode a JWT token and verify its authenticity.
    
    Args:
    - token (str): JWT token to decode.
    
    Returns:
    - dict: Payload of the decoded token if valid, None if invalid.
    """
    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except PyJWTError:
        # Return None if token decoding fails
        return None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency function to retrieve and validate the current user based on JWT token.
    
    Args:
    - token (str): JWT token passed in the request header.
    
    Returns:
    - dict: User details if authenticated and found in database.
    
    Raises:
    - HTTPException: If token is invalid or user is not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)

    # Raise exception if token decoding fails
    if payload is None:
        raise credentials_exception
    
    # Extract username from token payload
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    # Retrieve user from database
    user = user_collection.find_one({"username": username})

    # Raise exception if user is not found in database
    if user is None:
        raise credentials_exception
    
    # Return authenticated user
    return user

def authenticate_user(username: str, password: str):
    """
    Function to authenticate a user based on username and password.
    
    Args:
    - username (str): Username of the user.
    - password (str): Password provided by the user.
    
    Returns:
    - dict: User details if authentication is successful, None otherwise.
    """
    # Retrieve user from database
    user = user_collection.find_one({"username": username})

    # Verify password hash
    if user and pwd_context.verify(password, user["password"]):
        return user
    return None

async def create_user(user: User):
    """
    Function to create a new user in the database after validating username uniqueness.
    
    Args:
    - user (User): Pydantic model representing the user data.
    
    Returns:
    - dict: Success message if user creation is successful.
    
    Raises:
    - HTTPException: If username already exists.
    """
    # Check if username already exists
    existing_user = user_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Hash user password
    hashed_password = pwd_context.hash(user.password)
    user_data = {
        "username": user.username,
        "password": hashed_password,
        "created_at": datetime.now() # Set user creation timestamp
    }

    # Insert new user data into database
    user_collection.insert_one(user_data)
    return {"message": "User created successfully"}

@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Endpoint to authenticate user and generate access token.
    
    Args:
    - form_data (OAuth2PasswordRequestForm): Form data containing username and password.
    
    Returns:
    - dict: JSON response containing access token if authentication is successful.
    
    Raises:
    - HTTPException: If authentication fails (incorrect username or password).
    """
    # Authenticate user
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate access token
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/sing-up")
async def create_user_endpoint(user: User):
    # Call create_user function to register new user
    return await create_user(user)

# @router.get("/protected")
# def protected_route(current_user: dict = Depends(get_current_user)):
#     # Example protected endpoint that requires authentication.
#     return {"message": "You are authenticated"}
