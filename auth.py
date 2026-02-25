from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from cryptography.fernet import Fernet
import bcrypt
import mysql.connector

auth = Blueprint("auth", __name__)

# 🔹 Generate a consistent key — use the same one as in server.py
# For demo purpose, hardcoded. In production, securely store it!


key=b'WQj123SRuTWSIrSFravU77MtlwGaATRz_A6R_3rN9qY='
cipher_suite = Fernet(key)




def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="voice_chatbot_db"
    )

from flask import Blueprint, request, jsonify
import bcrypt
import hashlib
#from database import get_db_connection  # Assuming you have this defined

auth = Blueprint("auth", __name__)

# 🔒 SHA-256 hash function
def hash_text(text):
    return hashlib.sha256(text.encode()).hexdigest()

# 🔐 Signup Route
@auth.route("/signup", methods=["POST"])
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

    # Check if user already exists using hashed values
    cursor.execute("SELECT * FROM users WHERE email = %s OR username = %s",
                   (hashed_email, hashed_username))
    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({"error": "User already exists!"}), 409

    # Insert new user with hashed username/email
    cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                   (hashed_username, hashed_email, password))
    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Signup successful!"}), 201



@auth.route("/login", methods=["POST"])
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
        # Hash the input
        hashed_email = hash_text(email) if email else None
        hashed_username = hash_text(username) if username else None

        # Find the user
        if email:
            cursor.execute("SELECT * FROM users WHERE email = %s", (hashed_email,))
        elif username:
            cursor.execute("SELECT * FROM users WHERE username = %s", (hashed_username,))
        else:
            return jsonify({"error": "Invalid credentials!"}), 401

        user = cursor.fetchone()
        print("User fetched:", user)  # Add this line to see the fetched user

        if not user:
            return jsonify({"error": "User not found!"}), 404

        stored_password = user[3]  # Adjust if your DB column index is different
        print("Stored password:", stored_password)  # Add this to see the stored password

        if not bcrypt.checkpw(password.encode(), stored_password.encode()):
            return jsonify({"error": "Invalid password!"}), 401

        # Use unhashed email or username as identity
        identity = email if email else username

        access_token = create_access_token(identity=identity)

        return jsonify({"message": "Login successful!", "access_token": access_token}), 200

    except Exception as e:
        # Catch any exception and log it to see the error
        print("Error during login:", e)
        return jsonify({"error": "Server error", "details": str(e)}), 500

    finally:
        cursor.close()
        db.close()
