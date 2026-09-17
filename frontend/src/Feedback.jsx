import { useState } from "react";
import { useTheme } from "./ThemeContext";

function Feedback() {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating: Number(rating), comments }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.feedback_id) {
          setMessage("Thank you! Feedback ID: " + data.feedback_id);
        } else {
          setMessage("Something went wrong");
        }
      })
      .catch(() => setMessage("Could not connect to backend"));
  };

  const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  boxSizing: "border-box",
};

const labelStyle = {
  fontWeight: "bold",
  color: "#1F2937",
  fontSize: "14px",
};
  return (
    <div
  style={{
    maxWidth: "500px",
    margin: "60px auto",
    padding: "30px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    textAlign: "left",
  }}
>
  <h2 style={{ color: "#16325C", marginBottom: "20px", textAlign: "center" }}>
    Feedback
  </h2>

  <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={inputStyle}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Very Poor</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Comments:</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows="4"
            style={inputStyle}
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
          Submit
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "15px", color: "#2F9E44", textAlign: "center" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Feedback;