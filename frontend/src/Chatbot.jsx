import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "./ThemeContext";

function Chatbot({ currentUser }) {
  const { colors } = useTheme();
  const [input, setInput] = useState("");
  const historyKey = `chatHistory_${currentUser.user_id}`;

  // ✅ FIXED: load history directly as the initial state — no race condition possible
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(historyKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Save history every time messages change (this part was already correct)
  useEffect(() => {
    localStorage.setItem(historyKey, JSON.stringify(messages));
  }, [messages]);
  const suggestions = [
    "How do I check my result?",
    "Payment failed, what now?",
    "How to register for a course?",
  ];

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [...prev, { sender: "Bot", text: data.reply }]);
        setLoading(false);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "Bot", text: "Could not connect to backend" },
        ]);
        setLoading(false);
      });
  };

  const handleSuggestionClick = (text) => {
    setInput(text);
  };

  // ✅ NEW: clear history button
  const handleClearHistory = () => {
    const confirmed = window.confirm("Clear your entire chat history?");
    if (!confirmed) return;
    setMessages([]);
    localStorage.removeItem(historyKey);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        textAlign: "left",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: colors.card,
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ textAlign: "center", color: colors.heading, marginTop: 0, flex: 1 }}>
            Ask MPOnline
          </h1>
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              style={{
                background: "none",
                border: `1px solid ${colors.border}`,
                color: colors.subtext,
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div
          style={{
            height: "400px",
            overflowY: "auto",
            marginBottom: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 20px" }}>
              <p style={{ color: colors.subtext, fontSize: "15px", marginBottom: "20px" }}>
                👋 Hi! I'm here to help with MPOnline services — ask me anything
                about registration, payments, or certificates.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "20px",
                      border: `1px solid ${colors.navy}`,
                      backgroundColor: colors.card,
                      color: colors.text,
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            const isUser = msg.sender === "You";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "8px",
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                  maxWidth: "80%",
                  flexDirection: isUser ? "row-reverse" : "row",
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: colors.navy,
                      color: colors.gold,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    🤖
                  </div>
                )}
                <div
                  className={isUser ? "" : "bot-bubble"}
                  style={{
                    backgroundColor: isUser ? colors.navy : colors.bg,
                    color: isUser ? "#FFFFFF" : colors.text,
                    padding: "10px 14px",
                    borderRadius: isUser
                      ? "14px 14px 2px 14px"
                      : "14px 14px 14px 2px",
                    wordWrap: "break-word",
                  }}
                >
                  {isUser ? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
                </div>
              </div>
            );
          })}

          {loading && (
            <div
              style={{
                alignSelf: "flex-start",
                backgroundColor: colors.bg,
                padding: "10px 14px",
                borderRadius: "14px 14px 14px 2px",
                marginBottom: "8px",
                display: "flex",
                gap: "4px",
              }}
            >
              <span style={dotStyle}></span>
              <span style={{ ...dotStyle, animationDelay: "0.2s" }}></span>
              <span style={{ ...dotStyle, animationDelay: "0.4s" }}></span>
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} style={{ display: "flex", gap: "8px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#F5A623",
              color: "#16325C",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .bot-bubble p { margin: 0 0 8px 0; }
        .bot-bubble ul, .bot-bubble ol { margin: 4px 0; padding-left: 20px; }
        .bot-bubble strong { color: ${colors.heading}; }
      `}</style>
    </div>
  );
}

const dotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "#999",
  display: "inline-block",
  animation: "bounce 1.4s infinite ease-in-out both",
};

export default Chatbot;