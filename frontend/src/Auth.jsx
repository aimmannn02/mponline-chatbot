import { useState } from "react";
import { useTheme } from "./ThemeContext";

export default function Auth({ setCurrentUser, setView }) {
  const { colors } = useTheme();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!isLoginMode && !name.trim()) {
      setMessage("Please enter your name.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 5) {
      setMessage("Password must be at least 5 characters.");
      return;
    }

    setMessage("Processing...");

    const endpoint = isLoginMode ? "http://127.0.0.1:8000/login" : "http://127.0.0.1:8000/register";
    const payload = isLoginMode ? { email, password } : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginMode) {
          setMessage("Login successful!");
          setCurrentUser({ email, user_id: data.user_id, is_admin: data.is_admin });
        } else {
          setMessage("Registration successful! Logging you in...");

          const loginResponse = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok) {
            setCurrentUser({ email, user_id: loginData.user_id, is_admin: loginData.is_admin });
          } else {
            setMessage("Registered! Please log in.");
            setIsLoginMode(true);
          }
        }
      } else {
        setMessage(data.detail || "An error occurred.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Could not connect to backend.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "60px auto",
        padding: "30px",
        backgroundColor: colors.card,
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ color: colors.heading, marginBottom: "20px" }}>
        {isLoginMode ? "Login to MPOnline" : "Register New Account"}
      </h2>

      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
          <div style={{ marginBottom: "10px", textAlign: "left" }}>
            <label style={{ color: colors.text }}>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
        )}

        <div style={{ marginBottom: "10px", textAlign: "left" }}>
          <label style={{ color: colors.text }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label style={{ color: colors.text }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 20px",
            cursor: "pointer",
            width: "100%",
            backgroundColor: "#F5A623",
            color: "#16325C",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          {isLoginMode ? "Login" : "Register"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "15px", color: message.includes("success") ? "green" : "red" }}>
          {message}
        </p>
      )}

      <p style={{ marginTop: "20px", color: colors.text }}>
        {isLoginMode ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => { setIsLoginMode(!isLoginMode); setMessage(""); }}
          style={{ background: "none", border: "none", color: "#2563EB", cursor: "pointer", textDecoration: "underline" }}
        >
          {isLoginMode ? "Register here" : "Login here"}
        </button>
      </p>
    </div>
  );
}