
import mysql.connector

# 🔹 Connect to MySQL Database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root"
)

cursor = db.cursor()

# 🔹 Create Database (If Not Exists)
cursor.execute("CREATE DATABASE IF NOT EXISTS voice_chatbot_db")

# 🔹 Use the Database
cursor.execute("USE voice_chatbot_db")

# 🔹 Create Users Table (If Not Exists)
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
)
""")

db.commit()
cursor.close()
db.close()

print("✅ Database & Users Table Created Successfully!")
