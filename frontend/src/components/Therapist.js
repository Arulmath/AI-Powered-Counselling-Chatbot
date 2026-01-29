import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/therapist.css";
const Therapist = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const sendMessage = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/chat",
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, { user: input, bot: response.data.response }]);
      setInput("");
    } catch (error) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const startListening = async () => {
    const token = localStorage.getItem("token");
    setListening(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/voice_chat",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.error) {
        alert(response.data.error);
      } else {
        setMessages([
          ...messages,
          { user: `🎤 (Voice Message) + "${response.data.user_text}"`, bot: response.data.response }
        ]);
      }
    } catch (error) {
      alert("Voice chat failed. Please try again.");
    }

    setListening(false);
  };

  return (
    <div>
      <h2>AI Therapist</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>You:</strong> {msg.user} <br />
            <strong>Bot:</strong> {msg.bot}
          </p>
        ))}
      </div>
      <input 
        type="text" 
        placeholder="Type a message..." 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={startListening} disabled={listening}>
        {listening ? "Listening..." : "🎤 Speak"}
      </button>
    </div>
  );
};

export default Therapist;
