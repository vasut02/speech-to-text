from pymongo import MongoClient
from dotenv import dotenv_values

config = dotenv_values(".env")

try:
    mongodb_client = MongoClient(config["ATLAS_URI"])
    mongodb_client.admin.command('ping')
    print("You successfully connected to MongoDB!")
    database = mongodb_client.get_database('Transcripts_db')
    transcript_collection = database.get_collection("Transcripts")
    user_collection = database.get_collection("Users")
except Exception as e:
    print(e)