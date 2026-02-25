from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import mysql.connector
import bcrypt
import openai
#from openai import OpenAI
import pyttsx3
import speech_recognition as sr
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from auth import auth  # 👈 Import the auth blueprint\
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import speech_recognition as sr
import pyttsx3
import json
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()  # loads .env file

openai.api_key = os.getenv("openai.api_key")


# Register blueprint

# 🔹 Initialize Flask App
app = Flask(__name__)
#CORS(app, resources={r"/auth/*": {"origins": "http://localhost:3000"}})
#CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
CORS(app, origins="http://localhost:3000")

# 🔹 JWT Configuration
app.config["JWT_SECRET_KEY"] = "your_secret_key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600  # Token expires in 1 hour
jwt = JWTManager(app)

# 🔹 Function to Get a Fresh Database Connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="voice_chatbot_db"
    )

# 🔹 Encryption Key (Should be securely stored, NOT hardcoded)
#key = Fernet.generate_key() 
#print(key)# Save this key securely
key=b'WQj123SRuTWSIrSFravU77MtlwGaATRz_A6R_3rN9qY='
cipher_suite = Fernet(key)

# 🔹 AI Therapist Responses
predefined_responses = {
    "hello": "Hi Arulmathi! How can I assist you today?",
    "how are you": "I'm an AI, but I'm always ready to help!",
    "what is your name": "I am your AI therapist assistant.",
    "how do I deal with stress": "Try deep breathing, meditation, or talking to a friend.",
    "exit": "Goodbye! Stay strong!"
}

def generate_response(user_input):
    return predefined_responses.get(user_input, "I'm here to help! Please ask anything.")


import hashlib

# Hashing Function for Email/Username
def hash_text(text):
    return hashlib.sha256(text.encode()).hexdigest()


@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.json
    username = data["username"]
    email = data["email"]
    password = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt()).decode()

    # Hash username and email
    hashed_username = hash_text(username)
    hashed_email = hash_text(email)

    db = get_db_connection()
    cursor = db.cursor()

    # Check if user already exists
    cursor.execute("SELECT * FROM users WHERE email = %s OR username = %s", 
                   (hashed_email, hashed_username))
    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({"error": "User already exists!"}), 409

    # Insert new user
    cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", 
                   (hashed_username, hashed_email, password))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Signup successful!"}), 201

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not email and not username:
        return jsonify({"error": "Email or Username is required!"}), 400

    db = get_db_connection()
    cursor = db.cursor()

    try:
        hashed_email = hash_text(email) if email else None
        hashed_username = hash_text(username) if username else None

        if email:
            cursor.execute("SELECT * FROM users WHERE email = %s", (hashed_email,))
        elif username:
            cursor.execute("SELECT * FROM users WHERE username = %s", (hashed_username,))
        else:
            return jsonify({"error": "Invalid credentials!"}), 401

        user = cursor.fetchone()
        print("User fetched:", user)

        if not user:
            return jsonify({"error": "User not found!"}), 404

        stored_password = user[3]
        print("Stored password:", stored_password)

        if not bcrypt.checkpw(password.encode(), stored_password.encode()):
            return jsonify({"error": "Invalid password!"}), 401

        identity = email if email else username

       
        if isinstance(identity, bytes):
            identity = identity.decode()

        access_token = create_access_token(identity=identity)

      
        if isinstance(access_token, bytes):
            access_token = access_token.decode()
            print("Type of identity:", type(identity))
            print("Type of access_token:", type(access_token))


        return jsonify({"message": "Login successful!", "access_token": access_token}), 200

    except Exception as e:
        print("Error during login:", e)
        return jsonify({"error": "Server error", "details": str(e)}), 500

    finally:
        cursor.close()
        db.close()



def load_multimedia_data(filepath):
    multimedia_data = []
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            for line in file:
                multimedia_data.append(json.loads(line.strip()))
    except Exception as e:
        print(f"Error loading file: {e}")
    return multimedia_data


def prepare_embeddings(multimedia_data, model):
    questions = [entry["messages"][0]["content"] for entry in multimedia_data]
    embeddings = model.encode(questions)
    return embeddings


def find_best_multimedia_match(user_input, multimedia_data, embeddings, model):
    user_embedding = model.encode([user_input])
    similarities = cosine_similarity(user_embedding, embeddings)[0]

    best_index = np.argmax(similarities)
    best_score = similarities[best_index]

    if best_score >= 0.65:
        return multimedia_data[best_index]["messages"][1]["content"]
    else:
        return None


import openai
import os
openai.api_key = os.getenv("openai.api_key")

import openai
chat_history = [
    {"role": "system", "content": "You are a professional counselor specializing in women's and children's rights in Tamil Nadu. Your role is to provide empathetic, supportive, and legally accurate responses."}
]



from flask_jwt_extended import get_jwt_identity
from datetime import datetime

def handle_user_input(user_input, multimedia_data, embeddings, model):
    multimedia_keywords = ["video", "audio", "image"]

    user_identity = get_jwt_identity()
    encrypted_email = hash_text(user_identity)

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:
       
        cursor.execute(
            "SELECT sender, message FROM chat_history WHERE user_email=%s ORDER BY timestamp ASC",
            (encrypted_email,)
        )
        past_messages = cursor.fetchall()

        
        messages = [
            {"role": "system", "content": "You are a professional counselor specializing in women's and children's rights in Tamil Nadu. Your role is to provide empathetic, supportive, and legally accurate responses."}
        ]
        for msg in past_messages:
            messages.append({
                "role": "user" if msg['sender'] == 'user' else "assistant",
                "content": msg['message']
            })

      
        messages.append({"role": "user", "content": user_input})

       
        if any(keyword in user_input.lower() for keyword in multimedia_keywords):
            response = find_best_multimedia_match(user_input, multimedia_data, embeddings, model)
            if not response:
                response = "Sorry, I couldn't find any relevant multimedia content."
        else:
            api_response = openai.ChatCompletion.create(
                model="ft:gpt-3.5-turbo-0125:personal::BFl2VLnL",
                messages=messages,
                max_tokens=300
            )
            response = api_response['choices'][0]['message']['content'].strip()

       
        insert_query = "INSERT INTO chat_history (user_email, sender, message, timestamp) VALUES (%s, %s, %s, NOW())"
        cursor.execute(insert_query, (encrypted_email, "user", user_input))
        cursor.execute(insert_query, (encrypted_email, "bot", response))


        db.commit()

        return response

    except Exception as e:
        return f"Error handling input: {e}"

    finally:
        cursor.close()
        db.close()



multimedia_data = load_multimedia_data('D:\\project-trail\\voice_chatbot_project\\backend\\new_dataset.jsonl')
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = prepare_embeddings(multimedia_data, model)


@app.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message", "")
        if not user_input:
            return jsonify({"error": "No input provided"}), 400

        response = handle_user_input(user_input, multimedia_data, embeddings, model)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500









@app.route("/voice_chat", methods=["POST"])
@jwt_required()
def voice_chat():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("🎤 Listening...")
        recognizer.adjust_for_ambient_noise(source)
        
        try:
            audio = recognizer.listen(source, timeout=5)  # ✅ Timeout added
            user_text = recognizer.recognize_google(audio).lower()
            print(f"🗣 Recognized: {user_text}")  # ✅ Debugging line
            
           
            response_text = predefined_responses.get(user_text, "I'm here to help! Please ask anything.")

            #
            engine = pyttsx3.init()
            engine.say(response_text)
            engine.runAndWait()

            return jsonify({"user_text": user_text, "response": response_text})
        
        except sr.UnknownValueError:
            return jsonify({"error": "Could not understand. Please speak clearly."}), 400
        except sr.RequestError:
            return jsonify({"error": "Speech recognition service is unavailable."}), 500
        except Exception as e:
            return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


@app.route("/chat/history", methods=["GET"])
@jwt_required()
def chat_history_api():
    user_identity = get_jwt_identity()
    encrypted_email = hash_text(user_identity)  

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT sender, message, timestamp FROM chat_history WHERE user_email=%s ORDER BY timestamp ASC", (encrypted_email,))
    messages = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(messages)

@app.route("/healing/<category>", methods=["GET"])
@jwt_required()
def healing_content(category):
    
    data = {
        "breathing": {
            "messageType": "healing_breathing",
            "title": "Deep Breathing",
            "text": "Relax and breathe deeply with this GIF.",
            "gif_url": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXZvMGthbDFrOHBha3B6ZmNjMWp1ZDI0dnR3bHQ3ZGc2bDV3bHhiaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dDXZ3qU5nRBIe82Uit/giphy.gif"
        },
        "journaling": {
            "messageType": "text",
            "title": "Journaling Prompt",
            "prompts": [
                "Write down three things you're grateful for today.",
                "What made you smile this week?",
                "Describe a moment you felt proud of yourself."
            ]
        },
        "media": {
            "messageType": "video",
            "title": "Peaceful Piano Music",
            "url": "https://www.youtube.com/embed/1ZYbU82GVz4" 
        },
        "meditations": {
            "messageType": "audio",
            "title": "Guided Meditation for Anxiety",
            "url": "https://example.com/guided-meditation.mp3"
        },
        "stories": {
            "messageType": "story",
            "title": "A Brave Woman's Journey to Justice",
            "content": "Once upon a time, a woman stood up against injustice..."
        }
    }

  
    return jsonify(data.get(category, {}))

@app.route("/")
def home():
    return "Flask app is running with CORS enabled!"


app.register_blueprint(auth, url_prefix="/auth")  

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)

