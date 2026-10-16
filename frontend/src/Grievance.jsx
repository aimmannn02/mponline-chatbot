import { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";

function Grievance({ currentUser }) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Payment Issue");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [myGrievances, setMyGrievances] = useState([]);
  const [loadingGrievances, setLoadingGrievances] = useState(true);
  const [resolvedNotification, setResolvedNotification] = useState(""); // ✅ NEW

  const seenKey = `seenResolved_${currentUser.user_id}`; // ✅ NEW

  const fetchMyGrievances = () => {
    setLoadingGrievances(true);
    fetch(`http://127.0.0.1:8000/grievances/user/${currentUser.user_id}`)
      .then((res) => res.json())
      .then((data) => {
        setMyGrievances(data);
        checkForNewlyResolved(data); // ✅ NEW
      })
      .catch(() => console.error("Could not load grievance history"))
      .finally(() => setLoadingGrievances(false));
  };

  // ✅ NEW: compare against what we've already notified the user about
  const checkForNewlyResolved = (data) => {
    const seen = JSON.parse(localStorage.getItem(seenKey) || "[]");
    const newlyResolved = data.filter(
      (g) => g.status === "Resolved" && !seen.includes(g.id)
    );

    if (newlyResolved.length > 0) {
      const ids = newlyResolved.map((g) => `#${g.id}`).join(", ");
      setResolvedNotification(
        newlyResolved.length === 1
          ? `Good news! Your grievance ${ids} has been resolved.`
          : `Good news! Your grievances ${ids} have been resolved.`
      );

      const updatedSeen = [...seen, ...newlyResolved.map((g) => g.id)];
      localStorage.setItem(seenKey, JSON.stringify(updatedSeen));
    }
  };

  useEffect(() => {
    fetchMyGrievances();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }
    if (!description.trim()) {
      setMessage("Please describe your issue.");
      return;
    }

    fetch("http://127.0.0.1:8000/grievance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.user_id, name, category, description }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.grievance_id) {
          setMessage("Grievance submitted! Tracking ID: " + data.grievance_id);
          setName("");
          setDescription("");
          fetchMyGrievances();
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
    color: colors.text,
    fontSize: "14px",
  };

  const getStatusColor = (status) => {
    if (status === "Resolved") return "#16A34A";
    if (status === "In Progress") return "#2563EB";
    return "#D97706";
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "60px auto",
        padding: "30px",
        backgroundColor: colors.card,
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        textAlign: "left",
      }}
    >
      {/* ✅ NEW: resolved notification banner */}
      {resolvedNotification && (
        <div
          style={{
            backgroundColor: "#DCFCE7",
            color: "#166534",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontWeight: "bold",
            textAlign: "center",
            position: "relative",
          }}
        >
          {resolvedNotification}
          <button
            onClick={() => setResolvedNotification("")}
            style={{
              position: "absolute",
              top: "8px",
              right: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#166534",
            }}
          >
            ✕
          </button>
        </div>
      )}

      <h2 style={{ color: colors.heading, marginBottom: "20px", textAlign: "center" }}>
        Register a Grievance
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
          <label style={labelStyle}>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option>Payment Issue</option>
            <option>Certificate Issue</option>
            <option>Login Problem</option>
            <option>Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        <p style={{ marginTop: "15px", color: message.includes("submitted") ? "#2F9E44" : "#DC2626", textAlign: "center" }}>
          {message}
        </p>
      )}

      <hr style={{ margin: "30px 0", borderColor: colors.border }} />
      <h3 style={{ color: colors.heading, marginBottom: "15px", textAlign: "center" }}>
        My Grievances
      </h3>

      {loadingGrievances ? (
        <p style={{ textAlign: "center", color: colors.subtext }}>Loading your grievances...</p>
      ) : myGrievances.length === 0 ? (
        <p style={{ textAlign: "center", color: colors.subtext }}>
          You haven't submitted any grievances yet.
        </p>
      ) : (
        myGrievances.map((g) => (
          <div
            key={g.id}
            style={{
              border: `1px solid ${colors.border}`,
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: colors.text }}>#{g.id} — {g.category}</strong>
              <span
                style={{
                  backgroundColor: getStatusColor(g.status),
                  color: "white",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {g.status}
              </span>
            </div>
            <p style={{ color: colors.subtext, marginTop: "6px", marginBottom: 0 }}>
              {g.description}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Grievance;