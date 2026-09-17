import { useState } from "react";
import Auth from "./Auth";
import Grievance from "./Grievance";
import Feedback from "./Feedback";
import Dashboard from "./Dashboard";
import Chatbot from "./Chatbot";
import { useTheme } from "./ThemeContext";

function App() {
  const { darkMode, setDarkMode, colors } = useTheme();
  const [view, setView] = useState("chatbot");
  const [currentUser, setCurrentUser] = useState(null);

  const navButtonStyle = {
    backgroundColor: "#F5A623",
    color: "#16325C",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: colors.navy,
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
          MPOnline FAQ
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setView("auth")} style={navButtonStyle}>
            {currentUser ? "Account" : "Login / Register"}
          </button>
          <button onClick={() => setView("grievance")} style={navButtonStyle}>Grievance</button>
          <button onClick={() => setView("feedback")} style={navButtonStyle}>Feedback</button>
          {currentUser?.is_admin && (
            <button onClick={() => setView("dashboard")} style={navButtonStyle}>Dashboard</button>
          )}
          <button onClick={() => setView("chatbot")} style={navButtonStyle}>Chatbot</button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              ...navButtonStyle,
              backgroundColor: "transparent",
              border: "1px solid #F5A623",
              color: "#F5A623",
            }}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        {currentUser && (
          <p style={{ marginTop: "10px", color: "green" }}>
            Logged in as: <strong>{currentUser.email}</strong> {currentUser.is_admin ? "(Admin)" : ""}
          </p>
        )}

        <hr />

        {view === "auth" && <Auth setCurrentUser={setCurrentUser} setView={setView} />}
        {view === "grievance" && <Grievance />}
        {view === "feedback" && <Feedback />}
        {view === "chatbot" && <Chatbot />}

        {view === "dashboard" && (
          currentUser?.is_admin ? <Dashboard /> : <p style={{ color: "red" }}>Access Denied. Admins only.</p>
        )}
      </div>
    </div>
  );
}

export default App;