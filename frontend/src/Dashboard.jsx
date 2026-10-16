import { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";

function Dashboard({ currentUser }) {
  const { colors } = useTheme();
  const [grievances, setGrievances] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingGrievances, setLoadingGrievances] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchGrievances();

    setLoadingFeedback(true);
    fetch("http://127.0.0.1:8000/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbackList(data))
      .finally(() => setLoadingFeedback(false));
  }, []);

  const fetchGrievances = () => {
    setLoadingGrievances(true);
    fetch("http://127.0.0.1:8000/grievances")
      .then((res) => res.json())
      .then((data) => setGrievances(data))
      .finally(() => setLoadingGrievances(false));
  };

  const handleStatusChange = (grievanceId, newStatus) => {
    fetch(`http://127.0.0.1:8000/grievance/${grievanceId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, admin_id: currentUser.user_id }),
    })
      .then((res) => res.json())
      .then(() => {
        setGrievances((prev) =>
          prev.map((g) =>
            g.id === grievanceId ? { ...g, status: newStatus } : g
          )
        );
      })
      .catch(() => alert("Could not update status. Try again."));
  };

  const getStatusColor = (status) => {
    if (status === "Resolved") return "#16A34A";
    if (status === "In Progress") return "#2563EB";
    return "#D97706";
  };

  const filteredGrievances = grievances.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || g.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || g.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // ✅ NEW: count grievances per status for the bar chart
  const statusCounts = {
    Submitted: grievances.filter((g) => g.status === "Submitted").length,
    "In Progress": grievances.filter((g) => g.status === "In Progress").length,
    Resolved: grievances.filter((g) => g.status === "Resolved").length,
  };
  const maxCount = Math.max(...Object.values(statusCounts), 1); // avoid divide-by-zero

  // ✅ NEW: average feedback rating
  const averageRating =
    feedbackList.length > 0
      ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)
      : null;

  const filterSelectStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.card,
    color: colors.text,
    marginRight: "10px",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "left" }}>
      <h1 style={{ textAlign: "center", color: colors.heading }}>Analytics Dashboard</h1>

      {/* ✅ NEW: bar chart of grievances by status */}
      <div
        style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ color: colors.text, marginTop: 0, marginBottom: "15px" }}>Grievances by Status</h3>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: colors.text, fontSize: "14px", marginBottom: "4px" }}>
              <span>{status}</span>
              <span>{count}</span>
            </div>
            <div style={{ backgroundColor: colors.border, borderRadius: "6px", height: "16px", width: "100%" }}>
              <div
                style={{
                  width: `${(count / maxCount) * 100}%`,
                  backgroundColor: getStatusColor(status),
                  height: "100%",
                  borderRadius: "6px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ color: colors.text }}>Grievances ({filteredGrievances.length} of {grievances.length})</h2>

      <div style={{ marginBottom: "15px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...filterSelectStyle, flex: "1", minWidth: "150px" }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="All">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="All">All Categories</option>
          <option value="Payment Issue">Payment Issue</option>
          <option value="Certificate Issue">Certificate Issue</option>
          <option value="Login Problem">Login Problem</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {loadingGrievances ? (
        <p style={{ color: colors.subtext, textAlign: "center" }}>Loading grievances...</p>
      ) : filteredGrievances.length === 0 ? (
        <p style={{ color: colors.subtext, textAlign: "center" }}>No grievances match your search/filter.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.card,
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrievances.map((g) => (
              <tr key={g.id}>
                <td>{g.id}</td>
                <td>{g.name}</td>
                <td>{g.category}</td>
                <td>{g.description}</td>
                <td>
                  <select
                    value={g.status}
                    onChange={(e) => handleStatusChange(g.id, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "none",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: getStatusColor(g.status),
                    }}
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: "40px", color: colors.text }}>
        Feedback ({feedbackList.length})
        {averageRating && (
          <span style={{ fontSize: "16px", color: colors.subtext, marginLeft: "10px" }}>
            ⭐ Average: {averageRating} / 5
          </span>
        )}
      </h2>

      {loadingFeedback ? (
        <p style={{ color: colors.subtext, textAlign: "center" }}>Loading feedback...</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.card,
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Rating</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.name}</td>
                <td>{f.rating}</td>
                <td>{f.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;