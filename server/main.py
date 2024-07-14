from fastapi import FastAPI
from routers import auth, deepgram_api

app = FastAPI()

app.include_router(auth.router)
app.include_router(deepgram_api.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application"}
