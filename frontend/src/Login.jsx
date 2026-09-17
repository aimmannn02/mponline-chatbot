import { useState } from "react";

function Login() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [message, setMessage] = useState("");

 const handleSubmit = (e) => {
 e.preventDefault();
 fetch("http://127.0.0.1:8000/login", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ email, password }),
 })
 .then((res) => res.json())
 .then((data) => {
 if (data.user_id) {
 setMessage("Login successful! Welcome, user ID: " + data.user_id);
 } else {
 setMessage(data.detail || "Something went wrong");
 }
 })
 .catch(() => setMessage("Could not connect to backend"));
 };

 return (
 <div style={{ textAlign: "center", marginTop: "50px" }}>
 <h1>Login</h1>
 <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
 <div>
 <label>Email: </label>
 <input value={email} onChange={(e) => setEmail(e.target.value)} />
 </div>
 <div>
 <label>Password: </label>
 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
 </div>
 <button type="submit">Login</button>
 </form>
 <p>{message}</p>
 </div>
 );
}

export default Login;
