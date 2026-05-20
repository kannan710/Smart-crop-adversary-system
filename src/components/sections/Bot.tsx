import { useState, useEffect, useRef } from "react";

export default function AgriChatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "🌱 Welcome to AgriSense Assistant! Ask me about crops, weather, fertilizer, or farming tips." }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text })
      });

      const data = await res.json();
      const botMsg = { from: "bot", text: data.reply || "No response" };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Server error. Please try again." }
      ]);
    }
  };

  return (
    <div className="agri-chat-wrapper">
      <div className="agri-chat-card">
        <div className="agri-chat-header">
          <div className="title">🌱 AgriSense AI Assistant</div>
          <div className="subtitle">Smart farming support</div>
        </div>

        <div className="agri-chat-body">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.from === "bot" ? "msg bot" : "msg user"}
            >
              {m.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="agri-chat-footer">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about rice, weather, fertilizer, pests..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }


        .agri-chat-card {
          width: 100%;
          min-height: 450px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e6f2ee;
        }

        .agri-chat-header {
          background: linear-gradient(135deg, #0fb981, #0ea371);
          color: white;
          padding: 16px;
          display: flex;
          flex-direction: column;
        }

        .agri-chat-header .title {
          font-size: 16px;
          font-weight: 700;
        }

        .agri-chat-header .subtitle {
          font-size: 12px;
          opacity: 0.9;
        }

        .agri-chat-body {
          flex: 1;
          padding: 14px;
          overflow-y: auto;
          background: #f6fffb;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .msg {
          max-width: 80%;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.4;
          animation: fadeIn 0.2s ease-in-out;
        }

        .msg.bot {
          background: #e8f8f2;
          color: #065f46;
          align-self: flex-start;
          border-top-left-radius: 4px;
        }

        .msg.user {
          background: linear-gradient(135deg, #0fb981, #0ea371);
          color: white;
          align-self: flex-end;
          border-top-right-radius: 4px;
        }

        .agri-chat-footer {
          display: flex;
          padding: 12px;
          background: #ffffff;
          border-top: 1px solid #e6f2ee;
          gap: 8px;
        }

        .agri-chat-footer input {
          flex: 1;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1fae5;
          outline: none;
          font-size: 13px;
        }

        .agri-chat-footer input:focus {
          border-color: #0fb981;
          box-shadow: 0 0 0 2px rgba(15, 185, 129, 0.15);
        }

        .agri-chat-footer button {
          background: linear-gradient(135deg, #0fb981, #0ea371);
          border: none;
          color: white;
          padding: 0 16px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .agri-chat-footer button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(15, 185, 129, 0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 500px) {
          .agri-chat-card {
            width: 95vw;
            height: 90vh;
            right: 2.5vw;
          }
        }
      `}</style>
    </div>
  );
}