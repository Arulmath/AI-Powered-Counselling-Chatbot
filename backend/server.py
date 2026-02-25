from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import mysql.connector
import bcrypt
import openai
import pyttsx3
import speech_recognition as sr
from cryptography.fernet import Fernet
from auth import auth
from sklearn.metrics.pairwise import cosine_similarity
import json
import numpy as np
import os
import hashlib
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# ==============================
# OpenAI API Key (Render ENV)
# ==============================
openai.api_key = os.getenv("OPENAI_API_KEY")

# ==============================
# Flask App
# ==============================
app = Flask(__name__)

CORS(app, origins=[
    "http://localhost:3000",
    "https://ai-powered-counselling-chatbot.vercel.app"
])

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super_secret_key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600
jwt = JWTManager(app)

# ==============================
# Database Connection (Railway)
# ==============================
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT"))
    )

# ==============================
# Encryption Key
# ==============================
key = b'WQj123SRuTWSIrSFravU77MtlwGaATRz_A6R_3rN9qY='
cipher_suite = Fernet(key)

# ==============================
# Predefined Responses
# ==============================
predefined_responses = {
    "hello": "Hi Arulmathi! How can I assist you today?",
    "how are you": "I'm an AI, but I'm always ready to help!",
    "what is your name": "I am your AI therapist assistant.",
    "how do I deal with stress": "Try deep breathing, meditation, or talking to a friend.",
    "exit": "Goodbye! Stay strong!"
}

# ==============================
# Hash Function
# ==============================
def hash_text(text):
    return hashlib.sha256(text.encode()).hexdigest()

# ==============================
# Load Multimedia Dataset
# ==============================
def load_multimedia_data(filepath):
    multimedia_data = []
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            for line in file:
                multimedia_data.append(json.loads(line.strip()))
    except Exception as e:
        print(f"Error loading file: {e}")
    return multimedia_data

multimedia_data = load_multimedia_data("new_dataset.jsonl")

# ==============================
# Signup
# ==============================
@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.json
    username = data["username"]
    email = data["email"]
    password = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt()).decode()

    hashed_username = hash_text(username)
    hashed_email = hash_text(email)

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM users WHERE email = %s OR username = %s",
                   (hashed_email, hashed_username))
    if cursor.fetchone():
        return jsonify({"error": "User already exists!"}), 409

    cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                   (hashed_username, hashed_email, password))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Signup successful!"}), 201

# ==============================
# Login
# ==============================
@app.route("/auth/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    db = get_db_connection()
    cursor = db.cursor()

    hashed_email = hash_text(email) if email else None
    hashed_username = hash_text(username) if username else None

    if email:
        cursor.execute("SELECT * FROM users WHERE email=%s", (hashed_email,))
    else:
        cursor.execute("SELECT * FROM users WHERE username=%s", (hashed_username,))

    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "User not found!"}), 404

    if not bcrypt.checkpw(password.encode(), user[3].encode()):
        return jsonify({"error": "Invalid password!"}), 401

    identity = email if email else username
    access_token = create_access_token(identity=identity)

    cursor.close()
    db.close()

    return jsonify({"access_token": access_token}), 200

# ==============================
# Chat Logic (NO SentenceTransformer)
# ==============================
def handle_user_input(user_input):
    user_identity = get_jwt_identity()
    encrypted_email = hash_text(user_identity)

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT sender, message FROM chat_history WHERE user_email=%s ORDER BY timestamp ASC",
        (encrypted_email,)
    )
    past_messages = cursor.fetchall()

    messages = [
        {"role": "system", "content": "You are a professional counselor specializing in women's and children's rights in Tamil Nadu."}
    ]

    for msg in past_messages:
        messages.append({
            "role": "user" if msg['sender'] == 'user' else "assistant",
            "content": msg['message']
        })

    messages.append({"role": "user", "content": user_input})

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

    cursor.close()
    db.close()

    return response

@app.route("/chat", methods=["POST"])
@jwt_required()
def chat():
    data = request.get_json()
    user_input = data.get("message", "")
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    response = handle_user_input(user_input)
    return jsonify({"response": response})

# ==============================
# Chat History
# ==============================
@app.route("/chat/history", methods=["GET"])
@jwt_required()
def chat_history_api():
    user_identity = get_jwt_identity()
    encrypted_email = hash_text(user_identity)

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT sender, message, timestamp FROM chat_history WHERE user_email=%s ORDER BY timestamp ASC",
        (encrypted_email,)
    )
    messages = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(messages)

# ==============================
# Health Check (Required for Render)
# ==============================
@app.route("/healthz")
def health():
    return "OK", 200

@app.route("/")
def home():
    return "Flask app is running!"

app.register_blueprint(auth, url_prefix="/auth")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))

