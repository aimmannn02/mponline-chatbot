import { useState, useEffect } from "react";

function Dashboard() {
  const [grievances, setGrievances] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/grievances")
      .then((res) => res.json())
      .then((data) => setGrievances(data));

    fetch("http://127.0.0.1:8000/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbackList(data));
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "left" }}>
      <h1 style={{ textAlign: "center" }}>Analytics Dashboard</h1>

      <h2>Grievances ({grievances.length})</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
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
          {grievances.map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.name}</td>
              <td>{g.category}</td>
              <td>{g.description}</td>
              <td>{g.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "40px" }}>Feedback ({feedbackList.length})</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
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
    </div>
  );
}

export default Dashboard;