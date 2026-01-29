import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Welcome to the Women's Safety & Legal Awareness Counseling Platform. How can I assist you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:5000/chat/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const historyMessages = response.data.map((msg) => ({
          sender: msg.sender === "user" ? "user" : "bot",
          text: msg.message,
        }));

        setMessages([
          {
            sender: "bot",
            text: "Welcome to the Women's Safety & Legal Awareness Counseling Platform. How can I assist you?",
          },
          ...historyMessages,
        ]);
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleLinkClick = (e) => {
      if (e.target.classList.contains("chat-link")) {
        const url = e.target.getAttribute("data-url");
        setSelectedUrl(url);
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  const analyzeEmotion = async (text) => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze-emotion", { message: text });
      return res.data.emotion;
    } catch (error) {
      console.error("Emotion detection failed:", error);
      return "neutral";
    }
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const fetchHealingSuggestions = async (userText, emotion) => {
    const keywords = ["stress", "anxious", "panic", "overwhelmed", "tired", "exhausted"];
    const shouldSuggest =
      keywords.some((k) => userText.toLowerCase().includes(k)) ||
      ["sadness", "fear", "anger"].includes(emotion);

    if (!shouldSuggest) return "";

    const token = localStorage.getItem("token");
    const [breathing, journaling, media, meditations, stories] = await Promise.all([
      axios.get("http://127.0.0.1:5000/healing/breathing", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("http://127.0.0.1:5000/healing/journaling", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("http://127.0.0.1:5000/healing/media", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("http://127.0.0.1:5000/healing/meditations", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("http://127.0.0.1:5000/healing/stories", { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: `🎧 Here's a guided meditation that may help: ${meditations.data.title}`,
        audioUrl: meditations.data.url,
      },
    ]);

    return `🧘‍♀️ Here are some healing resources that might help:

🫁 **Breathing Exercise**: ${breathing.data.title}
✍️ **Journaling Prompt**: ${journaling.data.prompts[0]}
🎧 **Media Suggestion**: ${media.data.title} (${media.data.url})
🧘 **Meditation**: ${meditations.data.title}
📖 **Uplifting Story**: ${stories.data.title}`;
  };

  const sendMessage = async (userText) => {
    const userMessage = { sender: "user", text: userText };
    setMessages((prev) => [...prev, userMessage]);

    const token = localStorage.getItem("token");
    const emotion = await analyzeEmotion(userText);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/chat",
        { message: userText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let botText = response.data.response;

      const emotionMessages = {
        sadness: "😔 I sense you're feeling sad. You're not alone. I'm here to support you.\n\n",
        anger: "😠 It's okay to feel angry. Let’s try to talk this through calmly.\n\n",
        joy: "😊 I'm glad you're feeling good!\n\n",
        happiness: "😊 I'm glad you're feeling good!\n\n",
        fear: "😟 It’s okay to be afraid. Let’s figure things out together.\n\n",
        love: "❤️ Love is powerful. I’m happy to hear that.\n\n",
        surprise: "😲 That’s surprising! Tell me more!\n\n",
      };

      botText = (emotionMessages[emotion] || "") + botText;

      const healingText = await fetchHealingSuggestions(userText, emotion);
      if (healingText) botText += `\n\n${healingText}`;

      const botMessage = { sender: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);
      speak(botText);
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      setIsListening(false);
      console.error("Voice recognition error:", event.error);
    };
    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      sendMessage(voiceText);
    };

    recognition.start();
  };

  const renderMessageWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
  
    return text.replace(urlRegex, (url) => {
      // YouTube Embed
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return `
          <iframe width="100%" height="315"
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>`;
      }
  
      // Google Drive Audio Embed
      if (url.includes("drive.google.com") && url.includes("/file/")) {
        const fileIdMatch = url.match(/\/file\/d\/([^/]+)\//);
        if (fileIdMatch) {
          const fileId = fileIdMatch[1];
          return `
            <iframe width="100%" height="60"
              src="https://drive.google.com/file/d/${fileId}/preview"
              frameborder="0" allow="autoplay"></iframe>`;
        }
      }
  
      // Image Embed
      if (url.match(/\.(jpeg|jpg|gif|png)$/i)) {
        return `<img src="${url}" alt="image" style="max-width: 100%; border-radius: 12px; margin-top: 10px;" />`;
      }
  
      // Default Clickable Link
      return `<span class="chat-link" data-url="${url}" style="color: blue; text-decoration: underline; cursor: pointer;">${url}</span>`;
    });
  };
  
  

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <div dangerouslySetInnerHTML={{ __html: renderMessageWithLinks(msg.text) }} />
              {msg.gifUrl && (
                <img
                  src={msg.gifUrl}
                  alt="Visual Aid"
                  className="chat-gif"
                />
              )}
              {msg.audioUrl && (
                <audio controls className="chat-audio">
                  <source src={msg.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          ))}
        </div>

        {selectedUrl && (
          <aside className="chat-aside">
            <iframe src={selectedUrl} title="Link Viewer" width="100%" height="100%" style={{ border: "none" }} />
          </aside>
        )}

        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSend}>Send</button>
          <button onClick={handleVoiceInput} className="voice-button">
            🎙️ {isListening ? "Listening..." : "Speak"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
