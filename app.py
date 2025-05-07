from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash 

app = Flask(_name_)
CORS(app)


client = MongoClient("mongodb://localhost:27017/")
db = client['translationDB']
translations_collection = db['translations']
login_collection = db['login']  
users_collection = db['users']  

Mymemory_API_URL = "https://api.mymemory.translated.net/get"

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

   
    user = login_collection.find_one({"username": username})

    if user and check_password_hash(user['password'], password): 
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')  


    if login_collection.find_one({"username": username}):
        return jsonify({"success": False, "message": "Username already exists"}), 400

    
    hashed_password = generate_password_hash(password)

   
    login_collection.insert_one({"username": username, "password": hashed_password})

   
    users_collection.insert_one({
        "username": username,
        "email": email,
        "registered_at": data.get("registered_at")  
    })

    return jsonify({"success": True, "message": "User registered successfully"}), 201

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data['text']
    source_lang = data['sourceLang']
    target_lang = data['targetLang']

    api_url = f"https://api.mymemory.translated.net/get?q={text}&langpair={source_lang}|{target_lang}"

    try:
        response = requests.get(api_url)
        response_data = response.json()

        if response_data['responseStatus'] == 200:
            translated_text = response_data['responseData']['translatedText']

      
            translation_entry = {
                "originalText": text,
                "sourceLang": source_lang,
                "targetLang": target_lang,
                "translatedText": translated_text,
                "timestamp": response_data['responseData']['match'] 
            }
            translations_collection.insert_one(translation_entry)

            return jsonify({
                'translatedText': translated_text
            })
        else:
            return jsonify({
                'error': 'Translation failed.'
            }), 400
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if _name_ == '_main_':
    app.run(debug=True)