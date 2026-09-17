import { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Connecting...");

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.user_id) {
        setMessage("Login successful! Welcome, user ID: " + data.user_id);
        if (onLoginSuccess) {
          onLoginSuccess({ email, is_admin: data.is_admin });
        }
      } else {
        setMessage(data.detail || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Connection error:", err);
      setMessage("Could not connect to backend. Make sure FastAPI is running on port 8000.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 15px", cursor: "pointer" }}>
          Login
        </button>
      </form>
      {message && <p style={{ marginTop: "15px", color: "red" }}>{message}</p>}
    </div>
  );
}