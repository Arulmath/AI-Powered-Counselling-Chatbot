import requests

url = 'http://127.0.0.1:5000/chat'  # Make sure this is your correct server URL

data = {
    "message": "What are the key provisions in cybercrime laws?"
}

response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print("Response JSON:", response.json())
