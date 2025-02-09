from flask import Flask, request, jsonify
from pymongo import MongoClient, errors
import os
import time

app = Flask(__name__)
#URI MongoDB
mongo_uri = os.environ.get("MONGODB_URI", "mongodb://reading_user:reading_pass@mongodb-service:27017/readingappdb?authSource=admin")
print(f"Tentative de connexion à MongoDB via : {mongo_uri}")
MAX_RETRIES = 5  
WAIT_TIME = 5  
def connect_to_mongo():
    client = None
    for attempt in range(MAX_RETRIES):
        try:
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            client.server_info()  
            print("Connexion réussie à MongoDB.")
            return client
        except errors.ServerSelectionTimeoutError as err:
            print(f"Tentative {attempt+1}/{MAX_RETRIES} - MongoDB non prêt. Attente {WAIT_TIME}s...")
            time.sleep(WAIT_TIME)
        except errors.OperationFailure as err:
            print(f"Erreur d'authentification MongoDB : {err}")
            break
    print("Impossible de se connecter à MongoDB après plusieurs tentatives.")
    return None
client = connect_to_mongo()
if client:
    db = client.get_database()
    books_collection = db.books
else:
    print("Pas de connexion MongoDB. Arrêt de l'application.")
@app.route("/books", methods=["POST"])
def add_book():
    if not client:
        return jsonify({"error": "Connexion MongoDB non disponible"}), 500
    try:
        data = request.get_json()
        print(f"Data reçue : {data}")
        result = books_collection.insert_one(data)
        print(f"Insertion réussie avec l'ID : {result.inserted_id}")
        return jsonify({"message": "Livre ajouté avec succès !"}), 201
    except Exception as e:
        print(f"Erreur lors de l'insertion : {e}")
        return jsonify({"error": str(e)}), 500
@app.route("/books", methods=["GET"])
def get_books():
    if not client:
        return jsonify({"error": "Connexion MongoDB non disponible"}), 500
    try:
        books = list(books_collection.find({}, {"_id": 0}))
        return jsonify(books), 200
    except Exception as e:
        print(f"Erreur lors de la récupération des livres : {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
